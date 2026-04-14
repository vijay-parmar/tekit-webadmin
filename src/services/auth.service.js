/**
 * Auth Service
 * Business logic for authentication operations.
 */
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

/**
 * Authenticate admin with email & password
 * @param {string} email
 * @param {string} password
 * @returns {{ user: Object, token: string }}
 */
const login = async (email, password) => {
  // 1. Find user by email (include paranoid — only active, non-deleted)
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  // 2. Verify password
  const isMatch = await user.verifyPassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  // 3. Check account status
  if (user.status !== 'active') {
    const err = new Error('Your account has been deactivated. Contact a super admin.');
    err.statusCode = 403;
    throw err;
  }

  // 4. Issue JWT token
  const token = generateToken(user);

  // 5. Update last login timestamp
  await user.update({ last_login_at: new Date() });

  return { user: user.toSafeObject(), token };
};

/**
 * Generate a JWT access token for a user
 * @param {Object} user - Sequelize User instance
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Get the currently authenticated user's profile
 * @param {number} userId
 * @returns {Object} Safe user object
 */
const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password', 'deletedAt'] },
  });

  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  return user;
};

module.exports = { login, getMe, generateToken };
