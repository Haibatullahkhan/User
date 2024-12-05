const express = require('express');
const FeedbackController = require('../controllers/FeedbackController');
const router = express.Router();

// Submit feedback for an order
router.post('/', FeedbackController.submitFeedback);

// Get all feedback for a specific order
router.get('/:orderId', FeedbackController.getFeedbackByOrder);

// Get all feedback for a specific user
router.get('/user/:userId', FeedbackController.getFeedbackByUser);

// Get all feedback for a specific menu item
router.get('/menu/:menuItemId', FeedbackController.getFeedbackByMenuItem);

module.exports = router;
