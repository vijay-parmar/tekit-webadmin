'use strict';
/**
 * Seeder: Default Super Admin User
 * Creates an initial super_admin with full permissions.
 * Run: npm run db:seed
 */
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('Admin@12345', 12);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        name: 'Super Admin',
        email: 'admin@tekit.com',
        password: passwordHash,
        role: 'super_admin',
        permissions: JSON.stringify({
          blogs: { view: true, create: true, edit: true, delete: true },
          jobs:  { view: true, create: true, edit: true, delete: true },
        }),
        status: 'active',
        last_login_at: null,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ]);

    // Also seed some default categories
    await queryInterface.bulkInsert('categories', [
      { name: 'Technology',  slug: 'technology',  description: 'Tech articles and tutorials', created_at: now, updated_at: now, deleted_at: null },
      { name: 'Design',      slug: 'design',      description: 'UI/UX and graphic design',    created_at: now, updated_at: now, deleted_at: null },
      { name: 'Engineering', slug: 'engineering', description: 'Software engineering topics', created_at: now, updated_at: now, deleted_at: null },
      { name: 'Career',      slug: 'career',      description: 'Career tips and job search',  created_at: now, updated_at: now, deleted_at: null },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@tekit.com' });
    await queryInterface.bulkDelete('categories', {
      slug: ['technology', 'design', 'engineering', 'career'],
    });
  },
};
