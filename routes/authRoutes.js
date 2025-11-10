const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleWare/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', authenticate, getMe);

module.exports = router;
