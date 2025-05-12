'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING, unique: true },
      RG: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      category: { type: Sequelize.STRING },
      className: { type: Sequelize.STRING },
      refreshToken: { type: Sequelize.STRING },
      position: { type: Sequelize.ARRAY(Sequelize.FLOAT), defaultValue: [0, 0] },
      customIcon: { type: Sequelize.STRING, defaultValue: 'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png' },
      createAt: { type: Sequelize.STRING, defaultValue: new Date().toISOString() },
      updateAt: { type: Sequelize.STRING, defaultValue: new Date().toISOString() },
      status: { type: Sequelize.STRING, defaultValue: '' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    },{
      schema: 'internal'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users',{
      schema: 'internal'
    });
  }
};