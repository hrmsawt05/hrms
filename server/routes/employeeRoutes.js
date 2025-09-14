const express = require('express');
const router = express.Router();

// Import all necessary functions from the controller
const { 
    createUser, 
    getAllUsers, 
    getUserById,
    updateUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
    changeMyPassword
} = require('../controllers/employeeController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// --- Admin CRUD Routes for Managing All Users ---

// Create a new user
router.post('/', authMiddleware, roleMiddleware(['admin']), createUser);

// Get all users
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);

// Get, Update, and Delete a single user by ID using router.route() for cleaner code
router.route('/:id')
    .get(authMiddleware, roleMiddleware(['admin']), getUserById)
    .put(authMiddleware, roleMiddleware(['admin']), updateUser)
    .delete(authMiddleware, roleMiddleware(['admin']), deleteUser);


// --- Faculty/Employee Self-Service Routes ---

// Get the logged-in user's own profile
router.get('/profile/me', authMiddleware, getMyProfile);

// Update the logged-in user's own profile
router.put('/profile/me', authMiddleware, updateMyProfile);

// Change the logged-in user's password
router.put('/profile/change-password', authMiddleware, changeMyPassword);


module.exports = router;

