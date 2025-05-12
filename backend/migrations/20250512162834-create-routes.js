'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Routes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      path: { type: Sequelize.STRING, allowNull: false },
      component: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      requiredRole: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      pageId: { type: Sequelize.STRING },
      reportId: { type: Sequelize.STRING },
      workspaceId: { type: Sequelize.STRING },
      icon: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    },{
      schema: 'internal'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Routes',{
      schema: 'internal'
    });
  }
};