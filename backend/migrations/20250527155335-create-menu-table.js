const { Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('Menus', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      component: {
        type: Sequelize.STRING,
        allowNull: false
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      requiredRole: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      subRoutes: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      isDirectModule: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      pageId: {  // Nova coluna
        type: Sequelize.STRING,
        allowNull: true
      },
      reportId: {  // Nova coluna
        type: Sequelize.STRING,
        allowNull: true
      },
      workspaceId: {  // Nova coluna
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }, {
      schema: 'internal'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Menus', { schema: 'internal' });
  }
};