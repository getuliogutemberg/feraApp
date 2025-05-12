'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert({ tableName: 'Routes', schema: 'internal' }, [
      {
        path: '/rcp',
        component: 'Dashboard Power BI',
        name: 'RCP',
        requiredRole: [
            "ADMIN",
            "CLIENT",
            "OWNER"
          ],
        pageId: '3b870a41ac8a98644202',
        reportId: 'd7453238-0847-49af-812e-063f4ec7cf6c',
        workspaceId: '2d208505-5e87-45ad-bfc7-3845d74120aa',
        icon: 'chartColumn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        path: '/capex',
        component: 'Dashboard Power BI',
        name: 'CAPEX',
        requiredRole: [
            "ADMIN",
            "CLIENT",
            "OWNER"
          ],
        pageId: '00000000000000',
        reportId: '0a49bd5b-0c56-4876-aa9b-a1a214179bdb',
        workspaceId: '2d208505-5e87-45ad-bfc7-3845d74120aa',
        icon: 'chartColumn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        path: '/manutenção',
        component: 'Dashboard Power BI',
        name: 'Manutenção',
        requiredRole: [
            "ADMIN",
            "CLIENT",
            "OWNER"
          ],
        pageId: '00000000000000',
        reportId: '27207215-eb5a-4360-95e3-4b55aae5444a',
        workspaceId: '2d208505-5e87-45ad-bfc7-3845d74120aa',
        icon: 'chartColumn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        path: '/interrupções',
        component: 'Dashboard Power BI',
        name: 'Interrupções',
        requiredRole: [
            "ADMIN",
            "CLIENT",
            "OWNER"
          ],
        pageId: '0000000000000000000',
        reportId: '6f76665b-01cb-4f18-8aec-c0536f4c88f0',
        workspaceId: '2d208505-5e87-45ad-bfc7-3845d74120aa',
        icon: 'chartColumn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        path: '/energia-não-distribuída',
        component: 'Dashboard Power BI',
        name: 'Energia não Distribuída',
        requiredRole: [
            "ADMIN",
            "CLIENT",
            "OWNER"
          ],
        pageId: '0000000000000',
        reportId: '44162184-f221-4882-82f5-7117bcb4c858',
        workspaceId: '2d208505-5e87-45ad-bfc7-3845d74120aa',
        icon: 'chartColumn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        path: '/DEC-FEC',
        component: 'Dashboard Power BI',
        name: 'DEC/FEC',
        requiredRole:[
            "ADMIN",
            "CLIENT",
            "OWNER"
          ],
        pageId: '000000000',
        reportId: 'e19c3e1e-5134-4b8f-81ad-39bf18ed16ab',
        workspaceId: '2d208505-5e87-45ad-bfc7-3845d74120aa',
        icon: 'chartColumn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        path: '/ganho-agregado',
        component: 'Dashboard Power BI',
        name: 'Ganho Agregado',
        requiredRole: [
            "ADMIN",
            "CLIENT",
            "OWNER"
          ],
        pageId: '00000',
        reportId: '0243cb9e-9242-4d6c-8123-ae14da750075',
        workspaceId: '2d208505-5e87-45ad-bfc7-3845d74120aa',
        icon: 'chartColumn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        path: '/projeção-rul',
        component: 'Dashboard Power BI',
        name: 'Projeção de RUL',
        requiredRole: [
            "ADMIN",
            "CLIENT",
            "OWNER"
          ],
        pageId: '0000000',
        reportId: '6f054635-0f63-4a42-981c-c47e1e5221d8',
        workspaceId: '2d208505-5e87-45ad-bfc7-3845d74120aa',
        icon: 'chartColumn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        path: '/projeção-manutenção',
        component: 'Dashboard Power BI',
        name: 'Projeção de Manutenção',
        requiredRole: [
            "ADMIN",
            "CLIENT",
            "OWNER"
          ],
        pageId: '000000000',
        reportId: '518655cd-a690-4220-9a8b-d145ea70197e',
        workspaceId: '2d208505-5e87-45ad-bfc7-3845d74120aa',
        icon: 'chartColumn',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete({ tableName: 'Routes', schema: 'internal' }, null, {});
  }
}; 