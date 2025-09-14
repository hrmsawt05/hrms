const express = require('express');
const router = express.Router();
const { createDepartment, getAllDepartments } = require('../controllers/departmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// @desc    Admin creates a new department
// @route   POST /api/departments
// @access  Private/Admin
router.post('/', authMiddleware, roleMiddleware(['admin']), createDepartment);
//router.post('/', createDepartment);// Temporarily disabled auth for testing
// @desc    Any authenticated user can get the list of departments
// @route   GET /api/departments
// @access  Private
router.get('/', authMiddleware, getAllDepartments);

module.exports = router;

