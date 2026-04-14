/**
 * User Controller
 * HTTP layer for admin user management (RBAC).
 */
const userService = require('../services/user.service');
const { successResponse } = require('../utils/response');

/**
 * GET /api/users
 */
const listUsers = async (req, res, next) => {
  try {
    const users = await userService.listUsers();
    return successResponse(res, 'Users fetched.', users);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 */
const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, 'User fetched.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 */
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, 'Admin user created successfully.', user, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user);
    return successResponse(res, 'User updated successfully.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id, req.user.id);
    return successResponse(res, 'User deleted successfully.', result);
  } catch (error) {
    next(error);
  }
};

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
