import { Request, Response } from 'express';
import Menu, { MenuGroupAttributes } from '../models/Menu';
import Route from '../models/Route';

class MenuController {
  async getMenus_(_req: Request, res: Response) {
    try {
      // Verifica se já existem rotas no banco
      let routes = await Route.findAll();

      let menus = [
        {
          id: "2",
          name: "Diagnóstico",
          icon: "chartLine",
          component: 'MenuGroup',
          path: "/diagnóstico",
          subRoutes: routes.filter((route) =>
            ["RCP", "CAPEX", "Manutenção"].includes(route.name)
          ),
          requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        },
        {
          id: "3",
          name: "Análise de Criticidade",
          icon: "listFilter",
          component: 'MenuGroup',
          path: "/criticidade",
          subRoutes: routes.filter((route) =>
            ["Interrupções", "Energia não Distribuída", "DEC/FEC"].includes(route.name)
          ),
          requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        },
        ...routes
          .filter((route) => route.name === "Ganho Agregado")
          .map((route) => ({
            id: "4",
            name: route.name,
            icon: route.icon,
            component: route.component,
            path: route.path,
            requiredRole: route.requiredRole,
            pageId: route.pageId,
            reportId: route.reportId,
            workspaceId: route.workspaceId,
            subRoutes: [],
          })),
        {
          id: "5",
          name: "Projeções",
          icon: "listFilter",
          component: 'MenuGroup',
          path: "/projeções",
          subRoutes: routes.filter((route) =>
            ["Projeção de RUL", "Projeção de Manutenção"].includes(route.name)
          ),
          requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        },
        ...routes
          .filter((route) => route.name === "Priorizações")
          .map((route) => ({
            id: "6",
            name: route.name,
            icon: route.icon,
            component: route.component,
            path: route.path,
            requiredRole: route.requiredRole,
            pageId: route.pageId,
            reportId: route.reportId,
            workspaceId: route.workspaceId,
            subRoutes: [],
          })),
        ...routes
          .filter((route) => route.name === "FERA-2")
          .map((route) => ({
            id: "7",
            name: route.name,
            icon: route.icon,
            component: route.component,
            path: route.path,
            requiredRole: route.requiredRole,
            pageId: route.pageId,
            reportId: route.reportId,
            workspaceId: route.workspaceId,
            subRoutes: [],
          })),
        ...(routes.filter((route) => ![
          "FERA-2", "Priorizações", "Projeção de RUL", "Projeção de Manutenção",
          "Interrupções", "Energia não Distribuída", "DEC/FEC", "Ganho Agregado",
          "RCP", "CAPEX", "Manutenção"
        ].includes(route.name)).length > 0 ? [{
          id: "8",
          name: "Outros",
          icon: "chartColumn",
          component: 'MenuGroup',
          path: "/menu",
          subRoutes: routes.filter((route) => ![
            "FERA-2", "Priorizações", "Projeção de RUL", "Projeção de Manutenção",
            "Interrupções", "Energia não Distribuída", "DEC/FEC", "Ganho Agregado",
            "RCP", "CAPEX", "Manutenção"
          ].includes(route.name)),
          requiredRole: ["OWNER", "ADMIN", "CLIENT"],
        }] : [])
      ]
  
      // Se não houver rotas, cria as rotas padrão
    //   if (routes.length === 0) {
    //     const defaultRoutes: MenuAttributes[] = [
    //       // Adicione aqui as rotas padrão se necessário
    //     ];
  
    //     // Insere as rotas padrão no banco de dados
    //     if (defaultRoutes.length > 0) {
    //       await Menu.bulkCreate(defaultRoutes);
    //       routes = await Menu.findAll();
    //       console.log("Rotas padrão inseridas com sucesso.");
    //     }
    //     return res.status(200).json(menus);
    //   }
  
      // Caso existam rotas, retorna elas para o cliente
      return res.status(200).json(menus);
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao buscar rotas:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar rotas", 
        error: error.message 
      });
    }
  }
  async getMenus(_req: Request, res: Response) {
    try {
      const menus = await Menu.findAll();
      return res.status(200).json(menus);
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao buscar menus:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar menus", 
        error: error.message 
      });
    }
  }


  async createMenu(req: Request<{}, {}, { menuGroups: MenuGroupAttributes[] }>, res: Response) {
    try {
      const { menuGroups } = req.body;

      // Primeiro, limpa todos os menus existentes
      await Menu.destroy({
        where: {},
        truncate: true
      });

      // Depois, insere os novos menus
      await Menu.bulkCreate(menuGroups);

      return res.status(200).json({ message: "Menus atualizados com sucesso" });
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao salvar menus:", error);
      return res.status(500).json({ 
        message: "Erro ao salvar menus", 
        error: error.message 
      });
    }
  }
}

//   async updateMenu(req: Request<{ id: string }, {}, MenuAttributes>, res: Response) {
  
//   }

//   async deleteMenu(req: Request<{ id: string }>, res: Response) {
    
// }


export default new MenuController();