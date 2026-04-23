/**
 * Job Validators
 * Joi schemas for job posting CRUD operations.
 */
const Joi = require('joi');

const skillsArray = Joi.array().items(Joi.string().trim()).default([]);

const createJobSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  experience: Joi.string().max(100).allow('', null).optional(),
  location: Joi.string().max(150).allow('', null).optional(),
  notice_period: Joi.string().max(100).allow('', null).optional(),
  job_type: Joi.string().max(100).default('full-time'),
  description: Joi.string().min(10).required(),
  mandatory_skills: skillsArray,
  good_to_have_skills: skillsArray,
  responsibilities: skillsArray,
  benefits: skillsArray,
  status: Joi.string().valid('active', 'closed', 'draft').default('active'),
  vacancy: Joi.string().max(100).allow('', null).optional(),
});

const updateJobSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  experience: Joi.string().max(100).allow('', null).optional(),
  location: Joi.string().max(150).allow('', null).optional(),
  notice_period: Joi.string().max(100).allow('', null).optional(),
  job_type: Joi.string().max(100).optional(),
  description: Joi.string().min(10).optional(),
  mandatory_skills: skillsArray.optional(),
  good_to_have_skills: skillsArray.optional(),
  responsibilities: skillsArray.optional(),
  benefits: skillsArray.optional(),
  status: Joi.string().valid('active', 'closed', 'draft').optional(),
  vacancy: Joi.string().max(100).allow('', null).optional(),
}).min(1);

const listJobSchema = Joi.object({
  page: Joi.number().integer().positive().default(1),
  limit: Joi.number().integer().positive().max(100).default(10),
  search: Joi.string().trim().max(255).allow('').optional(),
  location: Joi.string().max(150).allow('').optional(),
  job_type: Joi.string().max(100).optional(),
  status: Joi.string().valid('active', 'closed', 'draft').optional(),
});

module.exports = { createJobSchema, updateJobSchema, listJobSchema };
