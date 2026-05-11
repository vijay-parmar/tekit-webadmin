'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Expand ENUM to contain both old and new values to prevent truncation
    await queryInterface.sequelize.query(`ALTER TABLE jobs MODIFY COLUMN status ENUM('active', 'inactive', 'on hold', 'closed', 'draft') DEFAULT 'active';`);
    // 2. Map old values to new values (closed -> inactive, draft -> inactive)
    await queryInterface.sequelize.query(`UPDATE jobs SET status = 'inactive' WHERE status IN ('closed', 'draft');`);
    // 3. Restrict ENUM to only the new values
    await queryInterface.sequelize.query(`ALTER TABLE jobs MODIFY COLUMN status ENUM('active', 'inactive', 'on hold') DEFAULT 'active';`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE jobs MODIFY COLUMN status ENUM('active', 'inactive', 'on hold', 'closed', 'draft') DEFAULT 'active';`);
    await queryInterface.sequelize.query(`UPDATE jobs SET status = 'draft' WHERE status = 'inactive';`);
    await queryInterface.sequelize.query(`ALTER TABLE jobs MODIFY COLUMN status ENUM('active', 'closed', 'draft') DEFAULT 'active';`);
  }
};
