const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Needed for password change

// --- Admin CRUD Functions ---

// @desc    Admin creates a new user
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, department, position, employeeIdString } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const newUser = new User({ firstName, lastName, email, password, role, department, position, employeeIdString });
        await newUser.save();
        const userResponse = newUser.toObject();
        delete userResponse.password;
        res.status(201).json({ message: 'User created successfully', user: userResponse });
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ message: 'Server error while creating user.', error: err.message });
    }
};

// @desc    Admin gets all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('department', 'departmentName').select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Admin gets a single user by ID
const getUserById = async (req, res) => {
    try {
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

// @desc    Admin updates a user's details
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields from request body
        const { firstName, lastName, email, role, position, department, employeeIdString, availableLeaves } = req.body;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.role = role || user.role;
        user.position = position || user.position;
        user.department = department || user.department;
        user.employeeIdString = employeeIdString || user.employeeIdString;
        user.availableLeaves = availableLeaves !== undefined ? availableLeaves : user.availableLeaves;

        const updatedUser = await user.save();
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json({ message: 'User updated successfully', user: userResponse });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ message: 'Server error while updating user.' });
    }
};


// @desc    Admin deletes a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Faculty/Employee Self-Service Functions ---

// @desc    A logged-in user gets their own profile
const getMyProfile = async (req, res) => {
    try {
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

// @desc    A logged-in user updates their own profile details
const updateMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Users can only update their name and email
        const { firstName, lastName, email } = req.body;
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'This email address is already in use.' });
            }
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;

        const updatedUser = await user.save();
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json({ message: 'Profile updated successfully', user: userResponse });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};

// @desc    A logged-in user changes their password
const changeMyPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide both old and new passwords.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long.'});
        }
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password.' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ message: 'Server error while changing password.' });
    }
};


module.exports = { 
    createUser, 
    getAllUsers, 
    getUserById, 
    updateUser,
    deleteUser,
    getMyProfile, 
    updateMyProfile, 
    changeMyPassword
};

