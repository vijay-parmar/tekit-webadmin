/**
 * Category Routes — mounted separately at /api/categories
 */
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const authenticate = require('../middlewares/authenticate');
const { requirePermission } = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator');

router.use(authenticate);

router.get('/', blogController.listCategories);
router.get('/:id', blogController.getCategory);

router.post(
  '/',
  requirePermission('blogs', 'create'),
  validate(createCategorySchema),
  blogController.createCategory
);

router.put(
  '/:id',
  requirePermission('blogs', 'edit'),
  validate(updateCategorySchema),
  blogController.updateCategory
);

router.delete(
  '/:id',
  requirePermission('blogs', 'delete'),
  blogController.deleteCategory
);

module.exports = router;
