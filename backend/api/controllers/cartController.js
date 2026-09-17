/**
 * CartController
 *
 * @description :: Server-side logic for managing user shopping carts & line items
 */
const CartService = require('../services/CartService');

module.exports = {

  getCart: async function (req, res) {
    try {
      const cart = await CartService.getCart(req.user.id);
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        data: cart
      });
    } catch (e) {
      console.error('@CartController getCart err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  addToCart: async function (req, res) {
    try {
      const { productId, quantity } = req.body;
      const fullCart = await CartService.addToCart(req.user.id, productId, quantity);

      return res.send({
        status: 200,
        success: true,
        message: 'Item added to cart',
        data: fullCart
      });
    } catch (e) {
      console.error('@CartController addToCart err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  updateCartItem: async function (req, res) {
    try {
      const { quantity } = req.body;
      const { itemId } = req.params;

      const fullCart = await CartService.updateCartItem(req.user.id, itemId, quantity);

      return res.send({
        status: 200,
        success: true,
        message: 'Cart item updated',
        data: fullCart
      });
    } catch (e) {
      console.error('@CartController updateCartItem err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  removeFromCart: async function (req, res) {
    try {
      const { itemId } = req.params;
      const fullCart = await CartService.removeFromCart(req.user.id, itemId);

      return res.send({
        status: 200,
        success: true,
        message: 'Item removed from cart',
        data: fullCart
      });
    } catch (e) {
      console.error('@CartController removeFromCart err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  }
};
