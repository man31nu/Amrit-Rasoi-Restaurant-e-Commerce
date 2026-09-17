/**
 * CartService
 *
 * @description :: Business logic service for shopping carts
 */

const CartModel = require('../models/CartModel');

module.exports = {
  getCart: async (userId) => {
    return await CartModel.getCartByUserId(userId);
  },

  addToCart: async (userId, productId, quantity) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    await CartModel.addItem(userId, productId, qty);
    return await CartModel.getCartByUserId(userId);
  },

  updateCartItem: async (userId, itemId, quantity) => {
    const updated = await CartModel.updateItem(itemId, userId, parseInt(quantity, 10));
    if (!updated) {
      throw new Error('Cart item not found');
    }
    return await CartModel.getCartByUserId(userId);
  },

  removeFromCart: async (userId, itemId) => {
    const removed = await CartModel.removeItem(itemId, userId);
    if (!removed) {
      throw new Error('Cart item not found');
    }
    return await CartModel.getCartByUserId(userId);
  }
};
