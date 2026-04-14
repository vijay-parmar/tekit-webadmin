/**
 * Auth Controller
 * Handles HTTP layer for authentication endpoints.
 */
const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * POST /api/admin/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    return successResponse(res, 'Login successful.', { user, token }, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/logout
 * JWT is stateless; client must discard token.
 * Optionally implement token blacklisting here in future.
 */
const logout = async (req, res) => {
  return successResponse(res, 'Logout successful. Please discard your token on the client side.', null);
};

/**
 * GET /api/admin/me
 */
const me = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return successResponse(res, 'User profile fetched.', user);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, me };
