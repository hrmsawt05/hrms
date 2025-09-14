const express = require('express');
const router = express.Router();

const {
    clockIn,
    clockOut,
    getMyAttendanceRecords,
    getEmployeeAttendanceForAdmin
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// --- Employee/Faculty Routes ---

// @desc    An employee clocks in for the day
// @route   POST /api/attendance/clockin
router.post('/clockin', authMiddleware, roleMiddleware(['employee']), clockIn);

// @desc    An employee clocks out for the day
// @route   POST /api/attendance/clockout
router.post('/clockout', authMiddleware, roleMiddleware(['employee']), clockOut);

// @desc    An employee gets their own attendance records
// @route   GET /api/attendance/my-records
router.get('/my-records', authMiddleware, roleMiddleware(['employee']), getMyAttendanceRecords);


// --- Admin/Management Routes ---

// @desc    Admin gets attendance for a specific employee
// @route   GET /api/attendance/admin/employee/:employeeId
router.get('/admin/employee/:employeeId', authMiddleware, roleMiddleware(['admin']), getEmployeeAttendanceForAdmin);

module.exports = router;

