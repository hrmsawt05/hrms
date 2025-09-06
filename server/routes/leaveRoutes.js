// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const {
    createLeaveRequest,
    getAllLeaveRequests,
    getMyLeaveRequests,
    updateLeaveRequest,
} = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Create a new leave request (Employee only)
router.post('/', authMiddleware, roleMiddleware(['employee']), createLeaveRequest);

// Get all leave requests (Admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllLeaveRequests);

// Get a single user's leave requests (Employee only)
router.get('/my-leaves', authMiddleware, roleMiddleware(['employee']), getMyLeaveRequests);

// Update a leave request status (Admin only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateLeaveRequest);

module.exports = router;
