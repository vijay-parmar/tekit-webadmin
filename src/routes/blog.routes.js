/**
 * Blog & Category Routes
 *
 * Blog:
 *   GET    /api/blogs
 *   GET    /api/blogs/:id
 *   POST   /api/blogs
 *   PUT    /api/blogs/:id
 *   DELETE /api/blogs/:id
 *
 * Category:
 *   GET    /api/categories
 *   GET    /api/categories/:id
 *   POST   /api/categories
 *   PUT    /api/categories/:id
 *   DELETE /api/categories/:id
 */
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const authenticate = require('../middlewares/authenticate');
const { requirePermission } = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const {
  createBlogSchema,
  updateBlogSchema,
  listBlogSchema,
} = require('../validators/blog.validator');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validators/category.validator');

// All routes require login
router.use(authenticate);

// ─── Blog Routes ──────────────────────────────────────────────────────────────

router.get(
  '/',
  requirePermission('blogs', 'view'),
  validate(listBlogSchema, 'query'),
  blogController.listBlogs
);

router.get(
  '/:id',
  requirePermission('blogs', 'view'),
  blogController.getBlog
);

router.post(
  '/',
  requirePermission('blogs', 'create'),
  upload.single('featured_image_url'),
  validate(createBlogSchema),
  blogController.createBlog
);

router.put(
  '/:id',
  requirePermission('blogs', 'edit'),
  upload.single('featured_image_url'),
  validate(updateBlogSchema),
  blogController.updateBlog
);

router.delete(
  '/:id',
  requirePermission('blogs', 'delete'),
  blogController.deleteBlog
);

module.exports = router;
