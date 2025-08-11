// routes/salaryRoutes.js
const express = require('express');
const router = express.Router();
const {
    createSalaryRecord,
    getAllSalaryRecords,
    getEmployeeSalaryRecords,
} = require('../controllers/salaryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ⭐ Create a new salary record (Admin only)
// Only users with an 'admin' role can create a new salary record.
router.post('/', authMiddleware, roleMiddleware(['admin']), createSalaryRecord);

// ⭐ Get all salary records (Admin only)
// This is an admin-only endpoint.
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllSalaryRecords);

// ⭐ Get salary records for a specific employee (Admin & Employee)
// The role middleware allows both roles, but the controller adds an extra check
// to ensure an employee can only see their own salary.
router.get('/employee/:employeeId', authMiddleware, roleMiddleware(['admin', 'employee']), getEmployeeSalaryRecords);

module.exports = router;
