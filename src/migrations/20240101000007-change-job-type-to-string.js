'use strict';
/** Migration: Change job_type column to STRING */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('jobs', 'job_type', {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: 'full-time',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('jobs', 'job_type', {
      type: Sequelize.ENUM('full-time', 'part-time', 'remote', 'contract', 'internship'),
      allowNull: false,
      defaultValue: 'full-time',
    });
  },
};
