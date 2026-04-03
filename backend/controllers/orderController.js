const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const { sendOrderConfirmation } = require('../services/emailService');
const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/orders/create
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items in order');
  }

  // 1. Create order in Razorpay
  const options = {
    amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paise)
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);

    // 2. Create order in our database
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        status: 'pending',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Razorpay Order Creation Failed');
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    dbOrderId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Update order status in DB
    const updatedOrder = await prisma.order.update({
      where: { id: dbOrderId },
      data: { status: 'paid' },
      include: { user: true }, // Include user to get email/name
    });

    // Send Email Notification (Phase 4.5)
    try {
      await sendOrderConfirmation(updatedOrder.user, updatedOrder);
    } catch (emailError) {
      console.error('Email Sending Failed:', emailError);
      // Don't fail the verification if email fails, just log it
    }

    res.status(200).json({
      success: true,
      message: 'Payment Verified Successfully',
      order: updatedOrder,
    });
  } else {
    res.status(400);
    throw new Error('Payment verification failed');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(orders);
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true }
      },
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(orders);
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const validStatuses = ['pending', 'paid', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const updatedOrder = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
    include: { user: true }
  });

  res.json(updatedOrder);
});

// @desc    Get admin analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  // 1. Total revenue and total orders
  const orders = await prisma.order.findMany({
    where: { status: { not: 'pending' } },
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;

  // 2. Total unique users who have ordered
  const totalUsersWithOrders = await prisma.order.groupBy({
    by: ['userId'],
    _count: { userId: true }
  });

  // 3. Sales for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: { notIn: ['pending', 'cancelled'] },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by date
  const salesByDate = recentOrders.reduce((acc, order) => {
    const date = order.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + order.totalAmount;
    return acc;
  }, {});

  res.json({
    totalRevenue,
    totalOrders,
    activeUsers: totalUsersWithOrders.length,
    salesByDate,
  });
});

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
};
