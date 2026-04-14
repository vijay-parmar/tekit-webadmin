/**
 * JWT Authentication Middleware
 * Validates Bearer token, attaches decoded user to req.user.
 */
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token has expired. Please login again.', 401);
      }
      return errorResponse(res, 'Invalid token.', 401);
    }

    // 3. Fetch user from DB (ensures user still exists and is active)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return errorResponse(res, 'User not found. Token is invalid.', 401);
    }

    if (user.status !== 'active') {
      return errorResponse(res, 'Your account has been deactivated.', 403);
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
