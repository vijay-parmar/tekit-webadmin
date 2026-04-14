/**
 * User (Admin) Model
 * Represents admin users with RBAC (role-based access control).
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin'),
      allowNull: false,
      defaultValue: 'admin',
    },
    /**
     * JSON permissions object e.g.:
     * { blogs: { view: true, create: true, edit: false, delete: false },
     *   jobs:  { view: true, create: false, edit: false, delete: false } }
     */
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        blogs: { view: true, create: false, edit: false, delete: false },
        jobs:  { view: true, create: false, edit: false, delete: false },
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Soft delete via deletedAt
    hooks: {
      // Hash password before create
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      // Hash password before update (only if changed)
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

/**
 * Instance method: verify plain password against hashed password
 */
User.prototype.verifyPassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

/**
 * Instance method: return safe user object (no password)
 */
User.prototype.toSafeObject = function () {
  const { password, deletedAt, ...safe } = this.toJSON();
  return safe;
};

module.exports = User;
