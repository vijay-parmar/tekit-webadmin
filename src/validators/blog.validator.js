/**
 * Blog Validators
 * Joi schemas for blog CRUD operations.
 */
const Joi = require('joi');

const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  category_id: Joi.number().integer().positive().allow(null).optional(),
  author: Joi.string().min(2).max(100).required(),
  date: Joi.date().iso().required(),
  featured_image_url: Joi.string().uri().max(500).allow('', null).optional(),
  summary: Joi.string().max(1000).allow('', null).optional(),
  content: Joi.string().min(10).required(),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
});

const updateBlogSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  category_id: Joi.number().integer().positive().allow(null).optional(),
  author: Joi.string().min(2).max(100).optional(),
  date: Joi.date().iso().optional(),
  featured_image_url: Joi.string().uri().max(500).allow('', null).optional(),
  summary: Joi.string().max(1000).allow('', null).optional(),
  content: Joi.string().min(10).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').optional(),
}).min(1); // At least one field must be provided

const listBlogSchema = Joi.object({
  page: Joi.number().integer().positive().default(1),
  limit: Joi.number().integer().positive().max(100).default(10),
  search: Joi.string().trim().max(255).allow('').optional(),
  category_id: Joi.number().integer().positive().optional(),
  status: Joi.string().valid('draft', 'published', 'archived').optional(),
});

module.exports = { createBlogSchema, updateBlogSchema, listBlogSchema };
