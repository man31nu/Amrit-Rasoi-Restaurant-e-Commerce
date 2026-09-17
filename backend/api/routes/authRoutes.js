const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/register', AuthController.registerUser);
router.post('/signup', AuthController.registerUser);

router.post('/login', AuthController.authUser);

router.post('/google-login', AuthController.googleLogin);
router.post('/google', AuthController.googleLogin);

router.get('/profile', protect, AuthController.getProfile);
router.put('/profile', protect, AuthController.updateProfile);

router.get('/users', protect, admin, AuthController.getUsers);
router.put('/users/:id/role', protect, admin, AuthController.updateUserRole);

module.exports = router;
