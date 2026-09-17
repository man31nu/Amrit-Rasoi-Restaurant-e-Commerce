const asyncHandler = require('express-async-handler');
const prisma = require('../prisma/client');

// @desc    Validate and apply promo coupon code
// @route   POST /api/coupons/apply
// @access  Public
const applyCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || !code.trim()) {
    res.status(400);
    throw new Error('Please enter a coupon code');
  }

  const numSubtotal = Number(subtotal);
  if (isNaN(numSubtotal) || numSubtotal <= 0) {
    res.status(400);
    throw new Error('Invalid subtotal amount');
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() }
  });

  if (!coupon || !coupon.isActive) {
    res.status(404);
    throw new Error('Invalid or expired coupon code');
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    res.status(400);
    throw new Error('This coupon code has expired');
  }

  if (numSubtotal < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`);
  }

  let discountAmount = (numSubtotal * coupon.discountPercent) / 100;
  if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
    discountAmount = coupon.maxDiscount;
  }

  discountAmount = Number(discountAmount.toFixed(2));
  const finalTotal = Number((numSubtotal - discountAmount).toFixed(2));

  res.json({
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    discountAmount,
    finalTotal,
    minOrderAmount: coupon.minOrderAmount
  });
});

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Public
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await prisma.coupon.findMany({
    where: { isActive: true },
    select: {
      id: true,
      code: true,
      discountPercent: true,
      minOrderAmount: true,
      maxDiscount: true,
      expiresAt: true
    }
  });

  res.json(coupons);
});

module.exports = {
  applyCoupon,
  getCoupons
};
