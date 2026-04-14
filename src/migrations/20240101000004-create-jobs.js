'use strict';
/** Migration: Create jobs table */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      experience: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      notice_period: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      job_type: {
        type: Sequelize.ENUM('full-time', 'part-time', 'remote', 'contract', 'internship'),
        allowNull: false,
        defaultValue: 'full-time',
      },
      description: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      mandatory_skills: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      good_to_have_skills: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      responsibilities: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      benefits: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'closed', 'draft'),
        allowNull: false,
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      created_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('jobs', ['status']);
    await queryInterface.addIndex('jobs', ['location']);
    await queryInterface.addIndex('jobs', ['job_type']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('jobs');
  },
};
