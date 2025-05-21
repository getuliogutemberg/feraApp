'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona a coluna jwtSecret
    await queryInterface.addColumn({ tableName: 'Users', schema: 'internal' }, 'jwtSecret', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({ tableName: 'Users', schema: 'internal' }, 'jwtSecret');
  }
}; 
