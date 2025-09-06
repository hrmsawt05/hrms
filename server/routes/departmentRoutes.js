const express = require('express');
const router = express.Router();
const { getAllDepartments } = require('../controllers/departmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// An admin needs to fetch the list of departments to create a new employee,
// so this route is protected for admins.
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllDepartments);

module.exports = router;
