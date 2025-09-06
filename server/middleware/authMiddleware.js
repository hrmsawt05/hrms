const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    // 1. Get token from header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token or invalid token format. Authorization denied.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find the user and attach to the request
        const user = await User.findById(decoded.id).select('-password');

        // *** ADDED CHECK ***
        // If the user associated with the token no longer exists
        if (!user) {
            return res.status(401).json({ message: 'User not found. Authorization denied.' });
        }

        req.user = user; // Attach the user object to the request
        next(); // Proceed to the next middleware or route handler

    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

module.exports = authMiddleware;
