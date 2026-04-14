/**
 * Slug Generator Utility
 * Auto-generates URL-safe slugs from titles, ensures uniqueness via DB check.
 */
const slugify = require('slugify');
const { Op } = require('sequelize');

/**
 * Generate a basic slug from a string
 * @param {string} text
 * @returns {string}
 */
const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,      // Remove non-alphanumeric characters
    trim: true,
  });
};

/**
 * Generate a unique slug by checking the database for collisions.
 * Appends a numeric suffix if the slug already exists.
 *
 * @param {string} title - Source text
 * @param {Object} Model - Sequelize model to check against
 * @param {number|null} excludeId - ID to exclude (for updates)
 * @returns {Promise<string>} Unique slug
 */
const generateUniqueSlug = async (title, Model, excludeId = null) => {
  let slug = generateSlug(title);
  let counter = 1;

  while (true) {
    const where = { slug };
    if (excludeId) where.id = { [Op.ne]: excludeId };

    const existing = await Model.findOne({ where });
    if (!existing) break;

    slug = `${generateSlug(title)}-${counter}`;
    counter++;
  }

  return slug;
};

module.exports = { generateSlug, generateUniqueSlug };
