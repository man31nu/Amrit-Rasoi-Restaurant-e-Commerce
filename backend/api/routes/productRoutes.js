const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/productController');
const ReviewController = require('../controllers/reviewController');

const { protect, admin } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', ProductController.getProducts);
router.get('/detail/:id', ProductController.getProductById);
router.get('/:id', ProductController.getProductById);

router.get('/reviews/:productId', ReviewController.getProductReviews);
router.get('/:productId/reviews', ReviewController.getProductReviews);
router.post('/reviews/:productId', protect, ReviewController.createReview);
router.post('/:productId/reviews', protect, ReviewController.createReview);

router.post('/', protect, admin, upload.single('image'), ProductController.createProduct);
router.put('/:id', protect, admin, upload.single('image'), ProductController.updateProduct);
router.delete('/:id', protect, admin, ProductController.deleteProduct);

module.exports = router;
