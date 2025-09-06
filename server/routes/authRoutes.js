// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// These routes are clean and simply point to the controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
