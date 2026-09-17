const asyncHandler = require('express-async-handler');
const prisma = require('../prisma/client');

// @desc    Create new review for a product
// @route   POST /api/products/:productId/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;
  const userId = req.user.id;

  const numRating = Number(rating);
  if (!numRating || numRating < 1 || numRating > 5) {
    res.status(400);
    throw new Error('Please provide a valid rating between 1 and 5');
  }

  if (!comment || comment.trim().length === 0) {
    res.status(400);
    throw new Error('Please enter a review comment');
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const existingReview = await prisma.review.findFirst({
    where: {
      productId,
      userId
    }
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already submitted a review for this dish');
  }

  const review = await prisma.review.create({
    data: {
      rating: numRating,
      comment: comment.trim(),
      productId,
      userId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  res.status(201).json(review);
});

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json(reviews);
});

module.exports = {
  createReview,
  getProductReviews
};
