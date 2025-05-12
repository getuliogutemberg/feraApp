'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Alerts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: { type: Sequelize.STRING },
      title: { type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      color: { type: Sequelize.STRING },
      icon: { type: Sequelize.STRING },
      deletedAt: { type: Sequelize.DATE, defaultValue: null },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    },{
      schema: 'internal'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Alerts',{
      schema: 'internal'
    });
  }
};
