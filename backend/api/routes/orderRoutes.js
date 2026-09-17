const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/orderController');

const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/create-order', protect, OrderController.createOrder);
router.post('/create', protect, OrderController.createOrder);

router.post('/verify-payment', protect, OrderController.verifyPayment);
router.post('/verify', protect, OrderController.verifyPayment);

router.get('/my-orders', protect, OrderController.getMyOrders);
router.get('/myorders', protect, OrderController.getMyOrders);

router.get('/all-orders', protect, admin, OrderController.getAllOrders);
router.get('/all', protect, admin, OrderController.getAllOrders);

router.get('/analytics', protect, admin, OrderController.getAnalytics);
router.put('/:id/status', protect, admin, OrderController.updateOrderStatus);

module.exports = router;
