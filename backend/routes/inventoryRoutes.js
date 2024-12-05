const express = require('express');
const InventoryController = require('../controllers/InventoryController');
const router = express.Router();

// Add a new inventory item
router.post('/', InventoryController.addInventoryItem);

// Update the quantity of an existing inventory item
router.put('/:id', InventoryController.updateInventoryItem);

// Get all inventory items
router.get('/', InventoryController.getAllInventoryItems);

// Get a specific inventory item
router.get('/:id', InventoryController.getInventoryItem);

// Delete an inventory item
router.delete('/:id', InventoryController.deleteInventoryItem);

module.exports = router;
