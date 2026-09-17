const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// Reviews routes
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', protect, createReview);

// Admin only routes
router.post('/', protect, admin, upload.single('image'), createProduct);
router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
