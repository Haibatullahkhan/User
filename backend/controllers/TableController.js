const { Table, User } = require('../models');

// Create a new Table
const createTable = async (req, res) => {
    try {
        const { tableNumber, capacity, status, location } = req.body;

        // Check if table number already exists
        const existingTable = await Table.findOne({ tableNumber });
        if (existingTable) {
            return res.status(400).json({ message: 'Table number already exists' });
        }

        // Create new table
        const newTable = new Table({
            tableNumber,
            capacity,
            status,
            location,
        });

        await newTable.save();
        res.status(201).json(newTable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all Tables
const getTables = async (req, res) => {
    try {
        const tables = await Table.find()
            .populate('reservedBy', 'username')
            .exec();
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Table by ID
const getTableById = async (req, res) => {
    try {
        const { id } = req.params;

        const table = await Table.findById(id)
            .populate('reservedBy', 'username')
            .exec();
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Table Information
const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { tableNumber, capacity, status, reservedBy, reservationTime, location } = req.body;

        const table = await Table.findById(id);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Optionally, prevent updates to the table number if it's being reserved
        if (table.status === 'RESERVED' && table.tableNumber !== tableNumber) {
            return res.status(400).json({ message: 'Cannot update table number when reserved' });
        }

        table.tableNumber = tableNumber || table.tableNumber;
        table.capacity = capacity || table.capacity;
        table.status = status || table.status;
        table.reservedBy = reservedBy || table.reservedBy;
        table.reservationTime = reservationTime || table.reservationTime;
        table.location = location || table.location;

        await table.save();
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Table
const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;

        const table = await Table.findByIdAndDelete(id);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        res.status(200).json({ message: 'Table deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reserve Table
const reserveTable = async (req, res) => {
    try {
        const { tableId, reservedBy, reservationTime } = req.body;

        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        if (table.status === 'RESERVED') {
            return res.status(400).json({ message: 'Table is already reserved' });
        }

        // Ensure the reservedBy user exists
        const user = await User.findById(reservedBy);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        table.status = 'RESERVED';
        table.reservedBy = reservedBy;
        table.reservationTime = reservationTime;

        await table.save();
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel Reservation
const cancelReservation = async (req, res) => {
    try {
        const { tableId } = req.params;

        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        if (table.status !== 'RESERVED') {
            return res.status(400).json({ message: 'Table is not reserved' });
        }

        table.status = 'AVAILABLE';
        table.reservedBy = null;
        table.reservationTime = null;

        await table.save();
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Change Table Status
const changeTableStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedTable = await Table.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedTable) {
            return res.status(404).json({ message: 'Table not found' });
        }

        res.status(200).json(updatedTable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTable,
    getTables,
    getTableById,
    updateTable,
    deleteTable,
    reserveTable,
    cancelReservation,
    changeTableStatus,
};
