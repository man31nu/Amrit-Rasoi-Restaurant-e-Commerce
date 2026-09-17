const express = require('express');
const router = express.Router();

const CouponController = require('../controllers/couponController');

router.get('/', CouponController.getCoupons);
router.post('/apply-coupon', CouponController.applyCoupon);
router.post('/apply', CouponController.applyCoupon);

module.exports = router;
