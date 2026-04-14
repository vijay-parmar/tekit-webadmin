/**
 * User Validators
 * Joi schemas for user management CRUD.
 */
const Joi = require('joi');

const permissionsSchema = Joi.object({
  blogs: Joi.object({
    view:   Joi.boolean().default(false),
    create: Joi.boolean().default(false),
    edit:   Joi.boolean().default(false),
    delete: Joi.boolean().default(false),
  }).default(),
  jobs: Joi.object({
    view:   Joi.boolean().default(false),
    create: Joi.boolean().default(false),
    edit:   Joi.boolean().default(false),
    delete: Joi.boolean().default(false),
  }).default(),
});

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters.',
  }),
  role: Joi.string().valid('super_admin', 'admin').default('admin'),
  permissions: permissionsSchema.optional(),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().lowercase().trim().optional(),
  password: Joi.string().min(8).optional(),
  role: Joi.string().valid('super_admin', 'admin').optional(),
  permissions: permissionsSchema.optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
}).min(1);

module.exports = { createUserSchema, updateUserSchema };
