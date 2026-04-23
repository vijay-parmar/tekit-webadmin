'use strict';
/** Migration: Change vacancy column to STRING */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('jobs', 'vacancy', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('jobs', 'vacancy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
    });
  },
};
