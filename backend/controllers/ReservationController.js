const { Reservation, User, Table } = require('../models');

// Create Reservation
const createReservation = async (req, res) => {
    try {
        const { customer, table, date, time, partySize, specialRequests } = req.body;

        // Validate customer
        const existingCustomer = await User.findById(customer);
        if (!existingCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Validate table
        const existingTable = await Table.findById(table);
        if (!existingTable) {
            return res.status(404).json({ message: 'Table not found' });
        }
        if (existingTable.status !== 'AVAILABLE') {
            return res.status(400).json({ message: 'Table is not available' });
        }

        // Create Reservation
        const newReservation = new Reservation({
            customer,
            table,
            date,
            time,
            partySize,
            specialRequests,
        });

        // Update table status
        existingTable.status = 'RESERVED';
        existingTable.reservedBy = customer;
        existingTable.reservationTime = new Date(`${date}T${time}`);
        await existingTable.save();

        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Reservations
const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('customer', 'username')
            .populate('table', 'tableNumber location');
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Reservation by ID
const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id)
            .populate('customer', 'username')
            .populate('table', 'tableNumber location');
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Reservation
const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedReservation = await Reservation.findByIdAndUpdate(id, updates, { new: true })
            .populate('customer', 'username')
            .populate('table', 'tableNumber location');
        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Reservation
const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByIdAndDelete(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Free up table
        const table = await Table.findById(reservation.table);
        if (table) {
            table.status = 'AVAILABLE';
            table.reservedBy = null;
            table.reservationTime = null;
            await table.save();
        }

        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
};
