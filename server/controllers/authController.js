//
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// A helper function to generate a JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in one day
    });
};


const registerUser = async (req, res) => {
    // Updated to match the consolidated User model schema
    const {
        firstName,
        lastName,
        employeeIdString,
        email,
        password,
        role,
        department // Department is now required for a new user
    } = req.body;

    // Basic validation
    if (!firstName || !employeeIdString || !email || !password || !department) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with that email already exists.' });
        }

        const newUser = await User.create({
            firstName,
            lastName,
            employeeIdString,
            email,
            password,
            role,
            department
        });

        const token = generateToken(newUser._id, newUser.role);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                fullName: newUser.fullName, // Using the virtual property
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        // *** KEY CHANGE HERE ***
        // We must explicitly ask for the password field due to `select: false` in the model.
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists AND if the password is correct
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized is more appropriate here
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

module.exports = { registerUser, loginUser };
