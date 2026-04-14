/**
 * Model Index
 * Loads all models, sets up associations, and exports them together.
 */
const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Blog = require('./Blog');
const Job = require('./Job');

// ─── Associations ────────────────────────────────────────────────────────────

// A Category has many Blogs; a Blog belongs to one Category
Category.hasMany(Blog, { foreignKey: 'category_id', as: 'blogs' });
Blog.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// ─────────────────────────────────────────────────────────────────────────────

const modelsWithTracking = [Category, Blog, Job];
modelsWithTracking.forEach((Model) => {
  Model.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
  Model.belongsTo(User, { as: 'updater', foreignKey: 'updated_by' });
});

module.exports = {
  sequelize,
  User,
  Category,
  Blog,
  Job,
};
