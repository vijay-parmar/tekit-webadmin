/**
 * Blog Service
 * CRUD + search/pagination business logic for Blog module.
 */
const { Op } = require('sequelize');
const { Blog, Category } = require('../models');
const { generateUniqueSlug } = require('../utils/slug');
const { getPagination } = require('../utils/pagination');
const { paginationMeta } = require('../utils/response');

/**
 * List blogs with search & pagination
 */
const listBlogs = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = {};

  // Search by title or author
  if (query.search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${query.search}%` } },
      { author: { [Op.like]: `%${query.search}%` } },
    ];
  }
  if (query.category_id) where.category_id = query.category_id;
  if (query.status) where.status = query.status;

  const { count, rows } = await Blog.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    include: [
      { association: 'category', attributes: ['id', 'name', 'slug'], required: false },
      { association: 'creator', attributes: ['id', 'name'] },
      { association: 'updater', attributes: ['id', 'name'] }
    ],
  });

  return {
    data: rows,
    meta: paginationMeta(count, page, limit),
  };
};

/**
 * Get a single blog by ID
 */
const getBlogById = async (id) => {
  const blog = await Blog.findByPk(id, {
    include: [
      { association: 'category', attributes: ['id', 'name', 'slug'] },
      { association: 'creator', attributes: ['id', 'name'] },
      { association: 'updater', attributes: ['id', 'name'] }
    ],
  });
  if (!blog) {
    const err = new Error('Blog post not found.');
    err.statusCode = 404;
    throw err;
  }
  return blog;
};

/**
 * Create a new blog post
 */
const createBlog = async (data, userId) => {
  // Auto-generate unique slug from title
  const slug = await generateUniqueSlug(data.title, Blog);
  return Blog.create({ ...data, slug, created_by: userId, updated_by: userId });
};

/**
 * Update a blog post
 */
const updateBlog = async (id, data, userId) => {
  const blog = await getBlogById(id);

  // If title changed, regenerate slug
  if (data.title && data.title !== blog.title) {
    data.slug = await generateUniqueSlug(data.title, Blog, id);
  }

  data.updated_by = userId;
  await blog.update(data);
  return blog.reload({ include: [
    { association: 'category', attributes: ['id', 'name', 'slug'] },
    { association: 'creator', attributes: ['id', 'name'] },
    { association: 'updater', attributes: ['id', 'name'] }
  ]});
};

/**
 * Soft delete a blog post
 */
const deleteBlog = async (id) => {
  const blog = await getBlogById(id);
  await blog.destroy(); // paranoid: soft delete
  return { id: blog.id };
};

module.exports = { listBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
