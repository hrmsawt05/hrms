// controllers/employeeController.js
const User = require('../models/User');

// @desc    Create a new user (employee)
// @route   POST /api/employees
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, department, position, employeeIdString } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role,
            department,
            position,
            employeeIdString
        });
        
        await newUser.save();

        // Don't send the password back
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ message: 'User created successfully', user: userResponse });
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ message: 'Server error while creating user.' });
    }
};


// @desc    Get all users (employees)
// @route   GET /api/employees
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        // Populate 'department' to get the department name instead of just the ID
        const users = await User.find().populate('department', 'departmentName').select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single user by ID
// @route   GET /api/employees/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        // Security Check: An admin can see any profile. An employee can only see their own.
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Access denied: You can only view your own profile.' });
        }

        const user = await User.findById(req.params.id).populate('department', 'departmentName').select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Get user by ID error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get the profile of the currently logged-in user
// @route   GET /api/employees/profile/me
// @access  Private (Employee or Admin)
const getMyProfile = async (req, res) => {
    try {
        // The user's ID is available from the authMiddleware (req.user._id)
        const user = await User.findById(req.user._id).populate('department', 'departmentName').select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        res.status(200).json(user);
    } catch (err) {
        console.error('Get my profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { createUser, getAllUsers, getUserById, getMyProfile };

