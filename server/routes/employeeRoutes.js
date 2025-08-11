// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const { createEmployee, getAllEmployees, getEmployeeById } = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ⭐ The router.post endpoint to create a new employee
// This route is protected by both authMiddleware and roleMiddleware(['admin'])
router.post('/', authMiddleware, roleMiddleware(['admin']), createEmployee);

// ⭐ The router.get endpoint to get all employees
// This route is also protected by both middleware, ensuring only admins can see the full list.
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllEmployees);

// ⭐ The router.get endpoint to get a single employee by ID
// This route is protected for both 'admin' and 'employee' roles.
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'employee']), getEmployeeById);

module.exports = router;
