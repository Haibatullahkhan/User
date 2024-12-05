const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Create a new order (customer only)
router.post('/', authMiddleware, OrderController.createOrder);

// Get all orders (admin or staff)
router.get('/', authMiddleware, adminMiddleware, OrderController.getAllOrders);

// Get a specific order by ID (customer or admin)
router.get('/:id', authMiddleware, OrderController.getOrderById);

// Update an order status (admin or staff)
router.put('/:id/status', authMiddleware, OrderController.updateOrderStatus);

// Delete an order (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, OrderController.deleteOrder);

module.exports = router;
