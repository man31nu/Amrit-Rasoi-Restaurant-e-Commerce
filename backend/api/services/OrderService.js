/**
 * OrderService
 *
 * @description :: Business logic service for order processing, Razorpay integration & analytics
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const OrderModel = require('../models/OrderModel');
const ProductModel = require('../models/ProductModel');
const CouponModel = require('../models/CouponModel');
const CartModel = require('../models/CartModel');
const UserModel = require('../models/UserModel');
const { sendOrderConfirmation } = require('./emailService');

module.exports = {
  createOrder: async (userId, payload) => {
    const { items, couponCode, deliveryAddress, deliveryNotes, paymentMethod } = payload;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('No items in order');
    }

    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const rawItem of items) {
      const pId = rawItem.productId || rawItem.id;
      const qty = Math.max(1, parseInt(rawItem.quantity, 10) || 1);

      const dbProduct = await ProductModel.getProductById(pId);

      if (!dbProduct) {
        throw new Error(`Product with ID ${pId} not found`);
      }

      if (!dbProduct.isAvailable) {
        throw new Error(`Product "${dbProduct.name}" is currently unavailable`);
      }

      const unitPrice = dbProduct.discountPrice && dbProduct.discountPrice < dbProduct.price 
        ? dbProduct.discountPrice 
        : dbProduct.price;
      const itemTotal = unitPrice * qty;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        quantity: qty,
        price: unitPrice,
        totalPrice: itemTotal
      });
    }

    let calculatedDiscount = 0;
    let validCouponCode = null;

    if (couponCode && couponCode.trim()) {
      const coupon = await CouponModel.getCouponByCode(couponCode.trim());

      if (coupon) {
        const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > new Date();

        if (coupon.isActive && isNotExpired && calculatedSubtotal >= coupon.minOrderAmount) {
          let disc = (calculatedSubtotal * coupon.discountPercent) / 100;
          if (coupon.maxDiscount && disc > coupon.maxDiscount) {
            disc = coupon.maxDiscount;
          }
          calculatedDiscount = Math.round(disc * 100) / 100;
          validCouponCode = coupon.code;
        }
      }
    }

    const taxAmount = Math.round(calculatedSubtotal * 0.05 * 100) / 100;
    const deliveryFee = calculatedSubtotal >= 500 ? 0 : 40;
    const finalTotalAmount = Math.max(0, Math.round((calculatedSubtotal + taxAmount + deliveryFee - calculatedDiscount) * 100) / 100);

    const orderNum = `AR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const amountPaise = Math.round(finalTotalAmount * 100);

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Payment service is not configured. Please contact support.');
    }

    const keyId = process.env.RAZORPAY_KEY_ID.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET.trim();

    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountPaise,
      currency: "INR",
      receipt: `receipt_${orderNum}`,
    };

    const razorpayOrder = await rzp.orders.create(options);

    const dbOrderId = await OrderModel.createOrderTransaction({
      userId,
      orderNum,
      subtotal: calculatedSubtotal,
      taxAmount,
      deliveryFee,
      discountAmount: calculatedDiscount,
      totalAmount: finalTotalAmount,
      couponCode: validCouponCode,
      paymentMethod,
      deliveryAddress,
      deliveryNotes,
      validatedItems
    });

    return {
      razorpayKeyId: keyId,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId,
      orderNumber: orderNum,
      subtotal: calculatedSubtotal,
      taxAmount,
      deliveryFee,
      discountAmount: calculatedDiscount,
      totalAmount: finalTotalAmount
    };
  },

  verifyPayment: async (userId, payload) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = payload;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      throw new Error('Payment verification failed');
    }

    const updatedOrder = await OrderModel.updatePaymentStatus(dbOrderId, razorpay_payment_id, userId);
    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    await CartModel.clearCartByUserId(userId);

    const user = await UserModel.findById(updatedOrder.userId);
    if (user) {
      updatedOrder.user = user;
      try {
        await sendOrderConfirmation(user, updatedOrder);
      } catch (emailErr) {
        console.error('Email sending failed:', emailErr);
      }
    }

    return updatedOrder;
  },

  getMyOrders: async (userId) => {
    return await OrderModel.getOrdersByUserId(userId);
  },

  getAllOrders: async () => {
    return await OrderModel.getAllOrders();
  },

  updateOrderStatus: async (orderId, status, updatedBy) => {
    const validStatuses = ['pending', 'paid', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const updatedOrder = await OrderModel.updateOrderStatus(orderId, status, updatedBy);
    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    const user = await UserModel.findById(updatedOrder.userId);
    if (user) {
      updatedOrder.user = user;
    }

    return updatedOrder;
  },

  getAnalytics: async () => {
    return await OrderModel.getAnalyticsData();
  }
};
