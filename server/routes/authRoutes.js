const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const router = express.Router();

// Login route
router.post('/login', loginUser);

// Register route (only for admin initially)
router.post('/register', registerUser);

module.exports = router;
