'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('blogs', 'featured_image_alt', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('blogs', 'featured_image_alt');
  }
};
