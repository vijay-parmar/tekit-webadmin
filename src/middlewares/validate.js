/**
 * Request Validation Middleware Factory
 * Validates req.body / req.query / req.params using a Joi schema.
 *
 * Usage:
 *   router.post('/login', validate(loginSchema), authController.login);
 */
const { errorResponse } = require('../utils/response');

/**
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @param {'body'|'query'|'params'} source - Which part of req to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,   // Collect ALL errors, not just the first
      stripUnknown: true,  // Remove fields not in schema
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, ''),
      }));
      return errorResponse(res, 'Validation failed.', 422, errors);
    }

    // Replace req[source] with the cleaned, coerced value
    req[source] = value;
    next();
  };
};

module.exports = validate;
