const express = require('express');
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/myorders', protect, getMyOrders);
router.get('/all', protect, admin, getAllOrders);
router.get('/analytics', protect, admin, getAnalytics);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
