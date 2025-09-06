const express = require('express');
const router = express.Router();
const {
    markMyAttendance,
    adminLogOrUpdateAttendance,
    getMyAttendanceRecords,
    getEmployeeAttendanceForAdmin
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// --- Employee Routes ---

// @desc    An employee marks their own attendance for today
// @route   POST /api/attendance/mark
router.post('/mark', authMiddleware, roleMiddleware(['employee']), markMyAttendance);

// @desc    An employee gets their own attendance records
// @route   GET /api/attendance/my-records
router.get('/my-records', authMiddleware, roleMiddleware(['employee']), getMyAttendanceRecords);


// --- Admin Routes ---

// @desc    Admin logs or updates attendance for an employee
// @route   POST /api/attendance/admin/log
router.post('/admin/log', authMiddleware, roleMiddleware(['admin']), adminLogOrUpdateAttendance);

// @desc    Admin gets attendance for a specific employee
// @route   GET /api/attendance/admin/employee/:employeeId
router.get('/admin/employee/:employeeId', authMiddleware, roleMiddleware(['admin']), getEmployeeAttendanceForAdmin);

module.exports = router;
