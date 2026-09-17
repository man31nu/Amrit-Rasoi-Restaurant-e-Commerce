/**
 * CouponService
 *
 * @description :: Business logic service for promo coupons
 */

const CouponModel = require('../models/CouponModel');

module.exports = {
  applyCoupon: async (payload) => {
    const { code, subtotal } = payload;

    if (!code || !code.trim()) {
      throw new Error('Please enter a coupon code');
    }

    const numSubtotal = Number(subtotal);
    if (isNaN(numSubtotal) || numSubtotal <= 0) {
      throw new Error('Invalid subtotal amount');
    }

    const coupon = await CouponModel.getCouponByCode(code.trim());

    if (!coupon || !coupon.isActive) {
      throw new Error('Invalid or expired coupon code');
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      throw new Error('This coupon code has expired');
    }

    if (numSubtotal < coupon.minOrderAmount) {
      throw new Error(`Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`);
    }

    let discountAmount = (numSubtotal * coupon.discountPercent) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    discountAmount = Number(discountAmount.toFixed(2));
    const finalTotal = Number((numSubtotal - discountAmount).toFixed(2));

    return {
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount,
      finalTotal,
      minOrderAmount: coupon.minOrderAmount
    };
  },

  getCoupons: async () => {
    return await CouponModel.getAllActiveCoupons();
  }
};
