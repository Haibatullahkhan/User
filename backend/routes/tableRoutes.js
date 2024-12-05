const express = require('express');
const TableController = require('../controllers/TableController');
const router = express.Router();

// Create a new table
router.post('/', TableController.createTable);

// Update table status (e.g., AVAILABLE, OCCUPIED, RESERVED)
router.put('/:id', TableController.updateTableStatus);

// Get all tables
router.get('/', TableController.getAllTables);

// Get a specific table by its ID
router.get('/:id', TableController.getTableById);

// Delete a table (if necessary)
router.delete('/:id', TableController.deleteTable);

module.exports = router;
