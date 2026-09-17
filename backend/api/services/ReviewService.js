/**
 * ReviewService
 *
 * @description :: Business logic service for customer ratings & reviews
 */

const ReviewModel = require('../models/ReviewModel');
const ProductModel = require('../models/ProductModel');

module.exports = {
  createReview: async (userId, user, productId, payload) => {
    const { rating, title, comment } = payload;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      throw new Error('Please provide a valid rating between 1 and 5');
    }

    if (!comment || comment.trim().length === 0) {
      throw new Error('Please enter a review comment');
    }

    const product = await ProductModel.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const existingReview = await ReviewModel.getReviewByUserAndProduct(productId, userId);
    if (existingReview) {
      throw new Error('You have already submitted a review for this dish');
    }

    return await ReviewModel.createReview({
      productId,
      userId,
      userName: user ? user.name : 'Diner',
      userAvatar: user ? user.avatarUrl : null,
      rating: numRating,
      title: title || null,
      comment: comment.trim(),
      createdBy: user ? user.email || user.id : userId
    });
  },

  getProductReviews: async (productId) => {
    return await ReviewModel.getReviewsByProductId(productId);
  }
};
