const { Order, User, MenuItem } = require('../models');

// Create Order
const createOrder = async (req, res) => {
    try {
        const { customer, items, orderType, paymentMethod, specialRequests } = req.body;

        // Validate customer existence
        const existingCustomer = await User.findById(customer);
        if (!existingCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Validate items
        let totalPrice = 0;
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return res.status(404).json({ message: `MenuItem with ID ${item.menuItem} not found` });
            }
            totalPrice += menuItem.price * item.quantity;
        }

        // Create order
        const newOrder = new Order({
            customer,
            items,
            totalPrice,
            orderType,
            paymentMethod,
            specialRequests,
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'username')
            .populate('items.menuItem', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('customer', 'username')
            .populate('items.menuItem', 'name price');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Order
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(id, updates, { new: true })
            .populate('customer', 'username')
            .populate('items.menuItem', 'name price');
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
