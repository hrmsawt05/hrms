const express = require('express');
const router = express.Router();

// Import all the necessary functions from the controller
const {
    createLeaveRequest,
    getAllLeaveRequests,
    getMyLeaveRequests,
    updateLeaveRequest,
    deleteLeaveRequest,
    getLeaveSummaryForEmployee
} = require('../controllers/leaveController');

// Import the security middleware
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


// --- Employee / Faculty Routes ---

// @desc    An employee applies for a new leave
// @route   POST /api/leaves/apply
router.post('/apply', authMiddleware, roleMiddleware(['employee']), createLeaveRequest);

// @desc    An employee gets their own leave history
// @route   GET /api/leaves/my-requests
router.get('/my-requests', authMiddleware, roleMiddleware(['employee']), getMyLeaveRequests);

// @desc    An employee gets their dashboard summary data (e.g., pending requests)
// @route   GET /api/leaves/my-summary
router.get('/my-summary', authMiddleware, roleMiddleware(['employee']), getLeaveSummaryForEmployee);


// --- Admin / Management Routes ---

// @desc    Admin gets all leave requests from all employees
// @route   GET /api/leaves/
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllLeaveRequests);

// @desc    Admin updates a leave request (approve/reject)
// @route   PUT /api/leaves/:id
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateLeaveRequest);

// @desc    Admin deletes a leave request
// @route   DELETE /api/leaves/:id
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteLeaveRequest);


module.exports = router;

