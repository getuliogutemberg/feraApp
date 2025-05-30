'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adiciona campos para recuperação de senha
    await queryInterface.addColumn(
      { tableName: 'Users', schema: 'internal' }, 
      'resetPasswordToken', 
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
    
    await queryInterface.addColumn(
      { tableName: 'Users', schema: 'internal' }, 
      'resetPasswordExpires', 
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // Remove os campos de recuperação de senha
    await queryInterface.removeColumn({ tableName: 'Users', schema: 'internal' }, 'resetPasswordToken');
    await queryInterface.removeColumn({ tableName: 'Users', schema: 'internal' }, 'resetPasswordExpires');
  }
};
