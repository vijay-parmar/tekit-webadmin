/**
 * Job Posting Model
 * Stores job listings with nested JSON arrays for skills, responsibilities, benefits.
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define(
  'Job',
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
    experience: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'e.g. "2-4 years", "Fresher"',
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    notice_period: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'e.g. "Immediate", "30 days", "60 days"',
    },
    job_type: {
      type: DataTypes.ENUM('full-time', 'part-time', 'remote', 'contract', 'internship'),
      allowNull: false,
      defaultValue: 'full-time',
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    /** JSON array of mandatory skill strings */
    mandatory_skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    /** JSON array of nice-to-have skill strings */
    good_to_have_skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    /** JSON array of responsibility strings */
    responsibilities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    /** JSON array of benefit strings */
    benefits: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'draft'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    tableName: 'jobs',
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
      { fields: ['status'] },
      { fields: ['location'] },
      { fields: ['job_type'] },
    ],
  }
);

module.exports = Job;
