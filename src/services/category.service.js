/**
 * Category Service
 * CRUD business logic for blog categories.
 */
const { Category } = require('../models');
const { generateUniqueSlug } = require('../utils/slug');

const listCategories = async () => {
  return Category.findAll({
    order: [['name', 'ASC']],
    include: [
      { association: 'creator', attributes: ['id', 'name'] },
      { association: 'updater', attributes: ['id', 'name'] }
    ]
  });
};

const getCategoryById = async (id) => {
  const category = await Category.findByPk(id, {
    include: [
      { association: 'creator', attributes: ['id', 'name'] },
      { association: 'updater', attributes: ['id', 'name'] }
    ]
  });
  if (!category) {
    const err = new Error('Category not found.');
    err.statusCode = 404;
    throw err;
  }
  return category;
};

const createCategory = async (data, userId) => {
  const slug = await generateUniqueSlug(data.name, Category);
  return Category.create({ ...data, slug, created_by: userId, updated_by: userId });
};

const updateCategory = async (id, data, userId) => {
  const category = await getCategoryById(id);
  if (data.name && data.name !== category.name) {
    data.slug = await generateUniqueSlug(data.name, Category, id);
  }
  data.updated_by = userId;
  await category.update(data);
  return category.reload({
    include: [
      { association: 'creator', attributes: ['id', 'name'] },
      { association: 'updater', attributes: ['id', 'name'] }
    ]
  });
};

const deleteCategory = async (id) => {
  const category = await getCategoryById(id);
  await category.destroy();
  return { id: category.id };
};

module.exports = { listCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
