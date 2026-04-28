/**
 * Blog Controller
 * HTTP layer for Blog + Category management.
 */
const blogService = require('../services/blog.service');
const categoryService = require('../services/category.service');
const { successResponse } = require('../utils/response');

/**
 * GET /api/blogs
 */
const listBlogs = async (req, res, next) => {
  try {
    const result = await blogService.listBlogs(req.query);
    return successResponse(res, 'Blogs fetched.', result.data, 200, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/:id
 */
const getBlog = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    return successResponse(res, 'Blog fetched.', blog);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/blogs
 */
const createBlog = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.featured_image_url = `/public/uploads/${req.file.filename}`;
    }
    const blog = await blogService.createBlog(req.body, req.user.id);
    return successResponse(res, 'Blog post created successfully.', blog, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/blogs/:id
 */
const updateBlog = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.featured_image_url = `/public/uploads/${req.file.filename}`;
    }
    const blog = await blogService.updateBlog(req.params.id, req.body, req.user.id);
    return successResponse(res, 'Blog post updated successfully.', blog);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/blogs/:id
 */
const deleteBlog = async (req, res, next) => {
  try {
    const result = await blogService.deleteBlog(req.params.id);
    return successResponse(res, 'Blog post deleted successfully.', result);
  } catch (error) {
    next(error);
  }
};

// ─── Category sub-controllers ─────────────────────────────────────────────────

/**
 * GET /api/categories
 */
const listCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.listCategories();
    return successResponse(res, 'Categories fetched.', categories);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:id
 */
const getCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return successResponse(res, 'Category fetched.', category);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/categories
 */
const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body, req.user.id);
    return successResponse(res, 'Category created.', category, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body, req.user.id);
    return successResponse(res, 'Category updated.', category);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    return successResponse(res, 'Category deleted.', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listBlogs, getBlog, createBlog, updateBlog, deleteBlog,
  listCategories, getCategory, createCategory, updateCategory, deleteCategory,
};
