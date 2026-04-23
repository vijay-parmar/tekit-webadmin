'use strict';
/** Migration: Add vacancy column to jobs table */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'vacancy', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'description', // Works primarily in MySQL/MariaDB
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('jobs', 'vacancy');
  },
};
