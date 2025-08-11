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

// ⭐ Create a new leave request (Employee only)
// Requires a valid token and the 'employee' role.
router.post('/', authMiddleware, roleMiddleware(['employee']), createLeaveRequest);

// ⭐ Get all leave requests (Admin only)
// Requires a valid token and the 'admin' role.
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllLeaveRequests);

// ⭐ Get a single user's leave requests (Employee only)
// Requires a valid token and the 'employee' role.
router.get('/my-leaves', authMiddleware, roleMiddleware(['employee']), getMyLeaveRequests);

// ⭐ Update a leave request status (Admin only)
// Requires a valid token and the 'admin' role.
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateLeaveRequest);

module.exports = router;
