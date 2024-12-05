const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Create a menu item (admin only)
router.post('/', authMiddleware, adminMiddleware, MenuController.createMenuItem);

// Get all menu items
router.get('/', MenuController.getAllMenuItems);

// Get a single menu item by ID
router.get('/:id', MenuController.getMenuItem);

// Update a menu item by ID (admin only)
router.put('/:id', authMiddleware, adminMiddleware, MenuController.updateMenuItem);

// Delete a menu item by ID (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, MenuController.deleteMenuItem);

module.exports = router;
