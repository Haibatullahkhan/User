const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware
const adminMiddleware = require('../middleware/adminMiddleware'); // Admin middleware

// User registration route
router.post('/register', UserController.register);

// User login route
router.post('/login', UserController.login);

// Get user profile (protected)
router.get('/profile', authMiddleware, UserController.getProfile);

// Update user profile (protected)
router.put('/profile', authMiddleware, UserController.updateProfile);

// Admin routes
// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, UserController.getAllUsers);

// Get a single user (admin or the user themselves)
router.get('/:id', authMiddleware, UserController.getUser);

// Update user by admin
router.put('/:id', authMiddleware, adminMiddleware, UserController.updateUser);

// Delete user by admin
router.delete('/:id', authMiddleware, adminMiddleware, UserController.deleteUser);

module.exports = router;
