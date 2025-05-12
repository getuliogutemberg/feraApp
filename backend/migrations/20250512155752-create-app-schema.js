'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primeiro, verifica se o schema existe
    const schemas = await queryInterface.showAllSchemas();
    if (!schemas.includes('app')) {
      await queryInterface.createSchema('app');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropSchema('app', { cascade: true });
  }
};