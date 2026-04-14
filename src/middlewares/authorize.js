/**
 * RBAC Authorization Middlewares
 * - requireRole: restrict access by role
 * - requirePermission: restrict access by specific resource permission
 */
const { errorResponse } = require('../utils/response');

/**
 * Restrict route to specific roles.
 * @param  {...string} roles - Allowed roles e.g. 'super_admin', 'admin'
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthenticated.', 401);
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Required role: ${roles.join(' or ')}.`,
        403
      );
    }
    next();
  };
};

/**
 * Restrict route to users who have a specific permission on a resource.
 * @param {string} resource - e.g. 'blogs', 'jobs'
 * @param {string} action   - e.g. 'view', 'create', 'edit', 'delete'
 */
const requirePermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthenticated.', 401);
    }

    // super_admin bypasses all permission checks
    if (req.user.role === 'super_admin') {
      return next();
    }

    const permissions = req.user.permissions || {};
    const resourcePerms = permissions[resource] || {};

    if (!resourcePerms[action]) {
      return errorResponse(
        res,
        `Access denied. You do not have '${action}' permission on '${resource}'.`,
        403
      );
    }

    next();
  };
};

module.exports = { requireRole, requirePermission };
