/**
 * CouponController
 *
 * @description :: Server-side logic for managing promo discounts & coupon validation
 */

const CouponService = require('../services/CouponService');

module.exports = {

  applyCoupon: async function (req, res) {
    try {
      const couponData = await CouponService.applyCoupon(req.body);
      return res.send({
        status: 200,
        success: true,
        message: 'Coupon applied successfully',
        data: couponData
      });
    } catch (e) {
      console.error('@CouponController applyCoupon err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  getCoupons: async function (req, res) {
    try {
      const coupons = await CouponService.getCoupons();
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        data: coupons
      });
    } catch (e) {
      console.error('@CouponController getCoupons err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  }
};
