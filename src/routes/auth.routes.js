/**
 * Auth Routes
 * POST /api/admin/login
 * POST /api/admin/logout
 * GET  /api/admin/me
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../validators/auth.validator');

// @route  POST /api/admin/login
// @access Public
router.post('/login', validate(loginSchema), authController.login);

// @route  POST /api/admin/logout
// @access Private
router.post('/logout', authenticate, authController.logout);

// @route  GET /api/admin/me
// @access Private
router.get('/me', authenticate, authController.me);

module.exports = router;
