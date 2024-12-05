const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Create a new reservation (customer only)
router.post('/', authMiddleware, ReservationController.createReservation);

// Get all reservations (admin or staff)
router.get('/', authMiddleware, adminMiddleware, ReservationController.getAllReservations);

// Get a specific reservation by ID (customer or admin)
router.get('/:id', authMiddleware, ReservationController.getReservationById);

// Update reservation status (admin or staff)
router.put('/:id/status', authMiddleware, ReservationController.updateReservationStatus);

// Delete a reservation (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, ReservationController.deleteReservation);

module.exports = router;
