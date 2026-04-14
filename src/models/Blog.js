/**
 * Blog Model
 * Stores blog posts with categories, author, rich content, and soft delete.
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blog = sequelize.define(
  'Blog',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true },
    },
    slug: {
      type: DataTypes.STRING(280),
      allowNull: false,
      unique: true,
    },
    /** FK to categories.id */
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    /** Publication date (can differ from createdAt) */
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    featured_image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    /** Full rich-text HTML content */
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
    },
  },
  {
    tableName: 'blogs',
    timestamps: true,
    paranoid: true,
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    updated_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    // Soft delete
    paranoid: true,
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    updated_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    // Soft delete
    indexes: [
      { fields: ['slug'] },
      { fields: ['category_id'] },
      { fields: ['status'] },
      { fields: ['date'] },
    ],
  }
);

module.exports = Blog;
