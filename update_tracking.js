const fs = require('fs');

const addTrackingToModel = (path) => {
  let content = fs.readFileSync(path, 'utf8');
  if (!content.includes('created_by')) {
    content = content.replace(/timestamps: true,/g, "timestamps: true,\n    paranoid: true, // Soft delete");
    content = content.replace(/paranoid: true, \//g, `paranoid: true,
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
    /`);
    
    // Fallback if the first replace failed (e.g. formatting differences)
    if (!content.includes('created_by: {')) {
        content = content.replace(/tableName:/, `created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    updated_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    tableName:`);
    }

    fs.writeFileSync(path, content, 'utf8');
  }
};

addTrackingToModel('src/models/Category.js');
addTrackingToModel('src/models/Blog.js');
addTrackingToModel('src/models/Job.js');

// Update Model Index Associations
let idxContent = fs.readFileSync('src/models/index.js', 'utf8');
if (!idxContent.includes('creator')) {
  idxContent = idxContent.replace(
    /module.exports = {/,
    `const modelsWithTracking = [Category, Blog, Job];
modelsWithTracking.forEach((Model) => {
  Model.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
  Model.belongsTo(User, { as: 'updater', foreignKey: 'updated_by' });
});

module.exports = {`
  );
  fs.writeFileSync('src/models/index.js', idxContent, 'utf8');
}

// Update Migrations
const addTrackingToMigration = (path) => {
  let content = fs.readFileSync(path, 'utf8');
  if (!content.includes('created_by: {')) {
    content = content.replace(
      /updated_at: {[^}]+},/,
      `updated_at: {
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
      },`
    );
    fs.writeFileSync(path, content, 'utf8');
  }
};

addTrackingToMigration('src/migrations/20240101000002-create-categories.js');
addTrackingToMigration('src/migrations/20240101000003-create-blogs.js');
addTrackingToMigration('src/migrations/20240101000004-create-jobs.js');

console.log("Database models and migrations updated.");
