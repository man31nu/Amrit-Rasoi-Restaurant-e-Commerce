const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const couponRoutes = require('./couponRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponRoutes);

const skipAuthRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/signup',
  '/api/auth/google-login',
  '/api/auth/google',
  '/api/products',
  '/api/coupons',
  '/api/coupons/apply-coupon'
];

module.exports = router;
module.exports.skipAuthRoutes = skipAuthRoutes;
