'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Configurations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      notifications: { type: Sequelize.BOOLEAN, defaultValue: true },
      allowRegister: { type: Sequelize.BOOLEAN, defaultValue: false },
      allowRequireRegister: { type: Sequelize.BOOLEAN, defaultValue: false },
      allowNewCategory: { type: Sequelize.BOOLEAN, defaultValue: false },
      allowNewClassName: { type: Sequelize.BOOLEAN, defaultValue: false },
      addSecretKey: { type: Sequelize.BOOLEAN, defaultValue: false },
      addCategory: { type: Sequelize.BOOLEAN, defaultValue: true },
      fontFamily: { type: Sequelize.STRING, defaultValue: 'Arial' },
      pageTitle: { type: Sequelize.STRING, defaultValue: 'Configurações' },
      themeMode: { type: Sequelize.ENUM('light', 'dark'), defaultValue: 'light' },
      primaryColor: { type: Sequelize.INTEGER, defaultValue: 56 },
      secondaryColor: { type: Sequelize.INTEGER, defaultValue: 180 },
      backgroundColor: { type: Sequelize.INTEGER, defaultValue: 0 },
      textColor: { type: Sequelize.INTEGER, defaultValue: 0 },
      pbiKeys: { type: Sequelize.JSONB },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    },{
      schema: 'app'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Configurations',{
      schema: 'app'
    });
  }
};
