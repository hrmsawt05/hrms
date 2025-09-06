const express = require('express');
const router = express.Router();

const { 
    createUser, 
    getAllUsers, 
    getUserById,
    getMyProfile 
} = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// @route   POST /api/employees
// @desc    Admin creates a new user/employee

router.post('/', authMiddleware, roleMiddleware(['admin']), createUser);

// @route   GET /api/employees
// @desc    Admin gets all users
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);

// @route   GET /api/employees/profile/me
// @desc    A logged-in user gets their own profile

router.get('/profile/me', authMiddleware, getMyProfile);

// @route   GET /api/employees/:id
// @desc    Get a single user by their ID
// Note: This general route comes AFTER the more specific '/profile/me' route
router.get('/:id', authMiddleware, getUserById);

module.exports = router;

