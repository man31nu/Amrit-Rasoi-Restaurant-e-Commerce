/**
 * ReviewController
 *
 * @description :: Server-side logic for managing customer ratings & product reviews
 */

const ReviewService = require('../services/ReviewService');

module.exports = {

  createReview: async function (req, res) {
    try {
      const newReview = await ReviewService.createReview(req.user.id, req.user, req.params.productId, req.body);
      return res.status(201).send({
        status: 201,
        success: true,
        message: 'Review created successfully',
        data: newReview
      });
    } catch (e) {
      console.error('@ReviewController createReview err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  },

  getProductReviews: async function (req, res) {
    try {
      const reviews = await ReviewService.getProductReviews(req.params.productId);
      return res.send({
        status: 200,
        success: true,
        message: 'success',
        data: reviews
      });
    } catch (e) {
      console.error('@ReviewController getProductReviews err:', e);
      return res.status(400).send({ status: 400, success: false, message: e.message });
    }
  }
};
