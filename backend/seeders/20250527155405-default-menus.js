module.exports = {
  up: async (queryInterface) => {
    const defaultMenus = [
      {
        id: "2",
        name: "Diagnóstico",
        icon: "chartLine",
        component: "MenuGroup",
        path: "/diagnóstico",
        subRoutes: JSON.stringify([
          {
            id: 1,
            path: "/rcp",
            component: "Dashboard Power BI",
            name: "RCP",
            requiredRole: ["ADMIN", "CLIENT", "OWNER"],
            pageId: "3b870a41ac8a98644202",
            reportId: "d7453238-0847-49af-812e-063f4ec7cf6c",
            workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
            icon: "chartColumn",
            createdAt: "2025-05-12T19:41:08.670Z",
            updatedAt: "2025-05-12T19:41:08.670Z"
          },
          {
            id: 2,
            path: "/capex",
            component: "Dashboard Power BI",
            name: "CAPEX",
            requiredRole: ["ADMIN", "CLIENT", "OWNER"],
            pageId: "00000000000000",
            reportId: "0a49bd5b-0c56-4876-aa9b-a1a214179bdb",
            workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
            icon: "chartColumn",
            createdAt: "2025-05-12T19:41:08.670Z",
            updatedAt: "2025-05-12T19:41:08.670Z"
          },
          {
            id: 3,
            path: "/manutenção",
            component: "Dashboard Power BI",
            name: "Manutenção",
            requiredRole: ["ADMIN", "CLIENT", "OWNER"],
            pageId: "00000000000000",
            reportId: "27207215-eb5a-4360-95e3-4b55aae5444a",
            workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
            icon: "chartColumn",
            createdAt: "2025-05-12T19:41:08.670Z",
            updatedAt: "2025-05-12T19:41:08.670Z"
          }
        ]),
        requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        isDirectModule: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        name: "Análise de Criticidade",
        icon: "listFilter",
        component: "MenuGroup",
        path: "/criticidade",
        subRoutes: JSON.stringify([
          {
            id: 4,
            path: "/interrupções",
            component: "Dashboard Power BI",
            name: "Interrupções",
            requiredRole: ["ADMIN", "CLIENT", "OWNER"],
            pageId: "0000000000000000000",
            reportId: "6f76665b-01cb-4f18-8aec-c0536f4c88f0",
            workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
            icon: "chartColumn",
            createdAt: "2025-05-12T19:41:08.670Z",
            updatedAt: "2025-05-12T19:41:08.670Z"
          },
          {
            id: 5,
            path: "/energia-não-distribuída",
            component: "Dashboard Power BI",
            name: "Energia não Distribuída",
            requiredRole: ["ADMIN", "CLIENT", "OWNER"],
            pageId: "0000000000000",
            reportId: "44162184-f221-4882-82f5-7117bcb4c858",
            workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
            icon: "chartColumn",
            createdAt: "2025-05-12T19:41:08.670Z",
            updatedAt: "2025-05-12T19:41:08.670Z"
          },
          {
            id: 6,
            path: "/DEC-FEC",
            component: "Dashboard Power BI",
            name: "DEC/FEC",
            requiredRole: ["ADMIN", "CLIENT", "OWNER"],
            pageId: "000000000",
            reportId: "e19c3e1e-5134-4b8f-81ad-39bf18ed16ab",
            workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
            icon: "chartColumn",
            createdAt: "2025-05-12T19:41:08.670Z",
            updatedAt: "2025-05-12T19:41:08.670Z"
          }
        ]),
        requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        isDirectModule: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "4",
        name: "Ganho Agregado",
        icon: "chartColumn",
        component: "Dashboard Power BI",
        path: "/ganho-agregado",
        requiredRole: ["ADMIN", "CLIENT", "OWNER"],
        pageId: "00000",
        reportId: "0243cb9e-9242-4d6c-8123-ae14da750075",
        workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
        subRoutes: JSON.stringify([]),
        isDirectModule: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "5",
        name: "Projeções",
        icon: "listFilter",
        component: "MenuGroup",
        path: "/projeções",
        subRoutes: JSON.stringify([
          {
            id: 8,
            path: "/projeção-rul",
            component: "Dashboard Power BI",
            name: "Projeção de RUL",
            requiredRole: ["ADMIN", "CLIENT", "OWNER"],
            pageId: "0000000",
            reportId: "6f054635-0f63-4a42-981c-c47e1e5221d8",
            workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
            icon: "chartColumn",
            createdAt: "2025-05-12T19:41:08.670Z",
            updatedAt: "2025-05-12T19:41:08.670Z"
          },
          {
            id: 9,
            path: "/projeção-manutenção",
            component: "Dashboard Power BI",
            name: "Projeção de Manutenção",
            requiredRole: ["ADMIN", "CLIENT", "OWNER"],
            pageId: "000000000",
            reportId: "518655cd-a690-4220-9a8b-d145ea70197e",
            workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
            icon: "chartColumn",
            createdAt: "2025-05-12T19:41:08.670Z",
            updatedAt: "2025-05-12T19:41:08.670Z"
          }
        ]),
        requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        isDirectModule: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "6",
        name: "Priorizações",
        icon: "chartLine",
        component: "Dashboard Power BI",
        path: "/priorizações",
        requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        pageId: "000000000",
        reportId: "18bbb174-30c1-4bd6-a365-c22f8771ac91",
        workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
        subRoutes: JSON.stringify([]),
        isDirectModule: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "7",
        name: "FERA-2",
        icon: "chartLine",
        component: "Dashboard Power BI",
        path: "/Fera-2",
        requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        pageId: "0000000000000000000",
        reportId: "74482258-831f-4367-9282-a4b81b83caca",
        workspaceId: "2d208505-5e87-45ad-bfc7-3845d74120aa",
        subRoutes: JSON.stringify([]),
        isDirectModule: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "8",
        name: "Outros",
        icon: "chartColumn",
        component: "MenuGroup",
        path: "/menu",
        subRoutes: JSON.stringify([
          {
            id: 12,
            path: "/teste",
            component: "Teste",
            name: "Modulo Teste",
            requiredRole: ["OWNER", "ADMIN", "CLIENT"],
            pageId: "",
            reportId: "",
            workspaceId: "",
            icon: "file",
            createdAt: "2025-05-26T18:59:03.254Z",
            updatedAt: "2025-05-26T18:59:03.254Z"
          }
        ]),
        requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        isDirectModule: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert({ tableName: 'Menus', schema: 'internal' }, defaultMenus);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete({ tableName: 'Menus', schema: 'internal' }, null);
  }
};