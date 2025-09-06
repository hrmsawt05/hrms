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

// Create a new salary record (Admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), createSalaryRecord);

// Get all salary records (Admin aonly)
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllSalaryRecords);

// Get salary records for a specific employee (Admin & Employee)
router.get('/employee/:employeeId', authMiddleware, roleMiddleware(['admin', 'employee']), getEmployeeSalaryRecords);

module.exports = router;
