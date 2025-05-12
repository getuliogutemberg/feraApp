'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const passwordCliente = await bcrypt.hash('123', 12);
    const passwordAdmin = await bcrypt.hash('123', 12);
    const passwordOwner = await bcrypt.hash('123', 12);
    await queryInterface.bulkInsert({ tableName: 'Users', schema: 'app' }, [
      {
        name: 'Cliente',
        email: 'cliente@fera.com.br',
        password: passwordCliente,
        category: 'FERA',
        className: 'CLIENT',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Administrador',
        email: 'admin@fera.com.br',
        password: passwordAdmin,
        category: 'FERA',
        className: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'INFORMA',
        email: 'owner@informa.com.br',
        password: passwordOwner,
        category: 'INFORMA',
        className: 'OWNER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete({ tableName: 'Users', schema: 'app' }, null, {});
  }
};
