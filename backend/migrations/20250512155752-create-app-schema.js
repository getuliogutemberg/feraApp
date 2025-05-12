'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primeiro, verifica se o schema existe
    const schemas = await queryInterface.showAllSchemas();
    if (!schemas.includes('internal')) {
      await queryInterface.createSchema('internal');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropSchema('internal', { cascade: true });
  }
};