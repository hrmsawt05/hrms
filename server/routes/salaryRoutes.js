const express = require('express');
const router = express.Router();
// Import all the necessary functions from your intelligent controller
const {
    createSalaryRecord,
    getAllSalaryRecords,
    getEmployeeSalaryRecordsForAdmin,
    getMySalaryRecords 
} = require('../controllers/salaryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// --- Admin/Management Routes ---

// @desc    Admin generates a new, calculated salary record for an employee
// @route   POST /api/salaries
router.post('/', authMiddleware, roleMiddleware(['admin']), createSalaryRecord);

// @desc    Admin gets a list of all salary records that have been generated
// @route   GET /api/salaries
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllSalaryRecords);

// @desc    Admin gets all salary records for one specific employee
// @route   GET /api/salaries/employee/:employeeId
router.get('/employee/:employeeId', authMiddleware, roleMiddleware(['admin']), getEmployeeSalaryRecordsForAdmin);


// --- Employee/Faculty Routes ---

// @desc    A logged-in employee gets their own salary history (payslips)
// @route   GET /api/salaries/my-records
router.get('/my-records', authMiddleware, roleMiddleware(['employee']), getMySalaryRecords);


module.exports = router;

