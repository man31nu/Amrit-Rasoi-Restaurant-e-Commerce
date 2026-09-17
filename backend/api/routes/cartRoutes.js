const express = require('express');
const router = express.Router();

/* Controllers */
const CartController = require('../controllers/cartController');

/* Middlewares */
const { protect } = require('../middlewares/authMiddleware');

/* Routes */
router.use(protect);

router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.put('/:itemId', CartController.updateCartItem);
router.delete('/:itemId', CartController.removeFromCart);

module.exports = router;
