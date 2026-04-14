/**
 * User Routes
 * GET    /api/users
 * GET    /api/users/:id
 * POST   /api/users
 * PUT    /api/users/:id
 * DELETE /api/users/:id
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/authenticate');
const { requireRole } = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createUserSchema, updateUserSchema } = require('../validators/user.validator');

// All user routes require authentication
router.use(authenticate);

// Only super_admin can manage admin users
router.get('/', requireRole('super_admin'), userController.listUsers);
router.get('/:id', requireRole('super_admin'), userController.getUser);

router.post(
  '/',
  requireRole('super_admin'),
  validate(createUserSchema),
  userController.createUser
);

router.put(
  '/:id',
  requireRole('super_admin'),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete('/:id', requireRole('super_admin'), userController.deleteUser);

module.exports = router;
