const { MenuItem, User } = require('../models');

// Create Menu Item
const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, ingredients, nutritionalInfo, allergens, preparationTime } = req.body;
        const createdBy = req.user.id; // Assume user info is attached to the request in middleware

        // Validate Price
        if (price <= 0) {
            return res.status(400).json({ message: 'Price must be greater than 0' });
        }

        // Create Menu Item
        const newMenuItem = new MenuItem({
            name,
            description,
            price,
            category,
            ingredients,
            nutritionalInfo,
            allergens,
            preparationTime,
            createdBy,
        });

        await newMenuItem.save();
        res.status(201).json(newMenuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Menu Items
const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().populate('createdBy', 'username');
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Menu Item by ID
const getMenuItemById = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await MenuItem.findById(id).populate('createdBy', 'username');
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Menu Item
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json(updatedMenuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Menu Item
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await MenuItem.findByIdAndDelete(id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createMenuItem,
    getMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
};
