const { Inventory, User } = require('../models');

// Create Inventory Item
const createInventoryItem = async (req, res) => {
    try {
        const { ingredient, quantity, unit, lowStockThreshold, restockedBy } = req.body;

        // Validate restockedBy user
        const restocker = await User.findById(restockedBy);
        if (!restocker) {
            return res.status(404).json({ message: 'Restocker not found' });
        }

        // Check if ingredient already exists
        const existingInventory = await Inventory.findOne({ ingredient });
        if (existingInventory) {
            return res.status(400).json({ message: `Ingredient ${ingredient} already exists` });
        }

        // Create inventory item
        const newInventoryItem = new Inventory({
            ingredient,
            quantity,
            unit,
            lowStockThreshold,
            restockedBy,
        });

        await newInventoryItem.save();
        res.status(201).json(newInventoryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Inventory Items
const getInventoryItems = async (req, res) => {
    try {
        const inventoryItems = await Inventory.find()
            .populate('restockedBy', 'username');
        res.status(200).json(inventoryItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Inventory Item by ID
const getInventoryItemById = async (req, res) => {
    try {
        const { id } = req.params;

        const inventoryItem = await Inventory.findById(id)
            .populate('restockedBy', 'username');
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json(inventoryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Inventory Item
const updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedInventoryItem = await Inventory.findByIdAndUpdate(id, updates, { new: true })
            .populate('restockedBy', 'username');
        if (!updatedInventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json(updatedInventoryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Inventory Item
const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;

        const inventoryItem = await Inventory.findByIdAndDelete(id);
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Restock Inventory Item
const restockInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, restockedBy } = req.body;

        // Validate restockedBy user
        const restocker = await User.findById(restockedBy);
        if (!restocker) {
            return res.status(404).json({ message: 'Restocker not found' });
        }

        const inventoryItem = await Inventory.findById(id);
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        // Update quantity
        inventoryItem.quantity += quantity;
        inventoryItem.lastRestocked = new Date();
        inventoryItem.restockedBy = restockedBy;

        await inventoryItem.save();
        res.status(200).json(inventoryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInventoryItem,
    getInventoryItems,
    getInventoryItemById,
    updateInventoryItem,
    deleteInventoryItem,
    restockInventoryItem,
};
