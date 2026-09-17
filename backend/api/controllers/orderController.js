/**
 * OrderController
 *
 * @description :: Server-side logic for managing customer orders, payment verification & analytics
 */
const OrderService = require('../services/OrderService');

module.exports = {

  createOrder: async function (req, res) {
    try {
      const orderData = await OrderService.createOrder(req.user.id, req.body);
      return res.status(201).send({
        status: 201,
        success: true,
        message: 'Order created successfully',
        data: orderData
      });
    } catch (e) {
      console.error('@OrderController createOrder err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  verifyPayment: async function (req, res) {
    try {
      const updatedOrder = await OrderService.verifyPayment(req.user.id, req.body);
      return res.status(200).send({
        status: 200,
        success: true,
        message: 'Payment Verified Successfully',
        data: updatedOrder,
      });
    } catch (e) {
      console.error('@OrderController verifyPayment err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  getMyOrders: async function (req, res) {
    try {
      const orders = await OrderService.getMyOrders(req.user.id);
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        data: orders
      });
    } catch (e) {
      console.error('@OrderController getMyOrders err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  getAllOrders: async function (req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        data: orders
      });
    } catch (e) {
      console.error('@OrderController getAllOrders err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  updateOrderStatus: async function (req, res) {
    try {
      const { status } = req.body;
      const updatedBy = req.user ? req.user.email || req.user.id : 'admin';
      const updatedOrder = await OrderService.updateOrderStatus(req.params.id, status, updatedBy);

      return res.send({
        status: 200,
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
      });
    } catch (e) {
      console.error('@OrderController updateOrderStatus err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  getAnalytics: async function (req, res) {
    try {
      const analytics = await OrderService.getAnalytics();
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        data: analytics
      });
    } catch (e) {
      console.error('@OrderController getAnalytics err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  }
};
