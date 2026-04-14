/**
 * User Service
 * Business logic for user management (RBAC).
 */
const { Op } = require('sequelize');
const { User } = require('../models');

/**
 * List all admin users
 */
const listUsers = async () => {
  return User.findAll({
    attributes: { exclude: ['password'] },
    order: [['created_at', 'DESC']],
    paranoid: false, // Include soft-deleted in listing for super_admin
  });
};

/**
 * Get a user by ID
 */
const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * Create a new admin user
 */
const createUser = async (data) => {
  // Check for duplicate email
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) {
    const err = new Error('A user with this email already exists.');
    err.statusCode = 409;
    throw err;
  }
  const user = await User.create(data); // password hashed via beforeCreate hook
  return user.toSafeObject();
};

/**
 * Update an admin user
 */
const updateUser = async (id, data, requestingUser) => {
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  // Prevent non-super_admin from escalating roles
  if (data.role && requestingUser.role !== 'super_admin') {
    const err = new Error('Only super admins can change user roles.');
    err.statusCode = 403;
    throw err;
  }

  // Check email uniqueness on update
  if (data.email && data.email !== user.email) {
    const existing = await User.findOne({ where: { email: data.email, id: { [Op.ne]: id } } });
    if (existing) {
      const err = new Error('A user with this email already exists.');
      err.statusCode = 409;
      throw err;
    }
  }

  await user.update(data); // password re-hashed via beforeUpdate hook if changed
  return user.toSafeObject();
};

/**
 * Soft delete a user
 */
const deleteUser = async (id, requestingUserId) => {
  if (parseInt(id, 10) === parseInt(requestingUserId, 10)) {
    const err = new Error('You cannot delete your own account.');
    err.statusCode = 400;
    throw err;
  }
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  await user.destroy(); // Soft delete
  return { id: user.id };
};

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser };
