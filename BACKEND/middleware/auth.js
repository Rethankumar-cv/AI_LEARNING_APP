/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - must be logged in
 */
const protect = async (req, res, next) => {
    try {
        console.log('🔐 Auth middleware - checking token...');
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('✅ Token found in header');
        }

        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ error: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified, user ID:', decoded.id);

        // Get user from token (exclude password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            console.log('❌ User not found in database');
            return res.status(401).json({ error: 'User not found' });
        }

        console.log('✅ Auth successful, proceeding to route');
        next();
    } catch (error) {
        console.error('❌ Auth error:', error.message);
        res.status(401).json({ error: 'Not authorized, token failed' });
    }
};

module.exports = { protect };
