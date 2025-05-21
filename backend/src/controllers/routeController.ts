import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Route, { RouteAttributes } from '../models/Route';

class RouteController {
  async getRoutes(_req: Request, res: Response) {
    try {
      // Verifica se já existem rotas no banco
      let routes = await Route.findAll();
  
      // Se não houver rotas, cria as rotas padrão
      if (routes.length === 0) {
        const defaultRoutes: RouteAttributes[] = [
          // Adicione aqui as rotas padrão se necessário
        ];
  
        // Insere as rotas padrão no banco de dados
        if (defaultRoutes.length > 0) {
          await Route.bulkCreate(defaultRoutes);
          routes = await Route.findAll();
          console.log("Rotas padrão inseridas com sucesso.");
        }
        return res.status(200).json(routes);
      }
  
      // Caso existam rotas, retorna elas para o cliente
      return res.status(200).json(routes);
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao buscar rotas:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar rotas", 
        error: error.message 
      });
    }
  }

  async createRoute(req: Request<{}, {}, RouteAttributes>, res: Response) {
    try {
      const { path, component, requiredRole, pageId, reportId, icon, name, workspaceId } = req.body;
  
      // Validações básicas
      if (!path || !component) {
        return res.status(400).json({ 
          message: "Path e component são campos obrigatórios" 
        });
      }
  
      // Verifica se já existe uma rota com o mesmo path
      const existingRoute = await Route.findOne({ where: { path } });
      if (existingRoute) {
        return res.status(400).json({ 
          message: "Já existe uma rota com este path" 
        });
      }
  
      // Cria a nova rota
      const newRoute = await Route.create({
        path,
        component,
        requiredRole: requiredRole || [],
        pageId: pageId || "",
        name: name || "",
        reportId: reportId || "",
        workspaceId: workspaceId || "",
        icon: icon || ""
      });
  
      // Retorna a rota criada
      return res.status(201).json(newRoute);
  
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao criar rota:", error);
      return res.status(500).json({ 
        message: "Erro ao criar rota", 
        error: error.message 
      });
    }
  }

  async updateRoute(req: Request<{ id: string }, {}, RouteAttributes>, res: Response) {
    try {
      const { path, component, requiredRole, pageId, reportId, workspaceId, icon, name } = req.body;
      const routeId = req.params.id;
  
      // Validações básicas
      if (!path || !component) {
        return res.status(400).json({ 
          message: "Path e component são campos obrigatórios" 
        });
      }
  
      // Verifica se existe uma rota com o mesmo path (exceto a própria rota)
      const existingRoute = await Route.findOne({ 
        where: { 
          path, 
          id: { [Op.not]: routeId } 
        }
      });
      
      if (existingRoute) {
        return res.status(400).json({ 
          message: "Já existe outra rota com este path" 
        });
      }
  
      // Atualiza a rota
      const [affectedCount] = await Route.update(
        {
          path,
          component,
          name,
          requiredRole: requiredRole || [],
          pageId: pageId || "",
          reportId: reportId || "",
          workspaceId: workspaceId || "",
          icon: icon || ""
        },
        { where: { id: routeId } }
      );
  
      if (affectedCount === 0) {
        return res.status(404).json({ 
          message: "Rota não encontrada" 
        });
      }
  
      const updatedRoute = await Route.findByPk(routeId);
      return res.json(updatedRoute);
  
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao atualizar rota:", error);
      return res.status(500).json({ 
        message: "Erro ao atualizar rota", 
        error: error.message 
      });
    }
  }

  async deleteRoute(req: Request<{ id: string }>, res: Response) {
    try {
      const routeId = req.params.id;
      const route = await Route.findByPk(routeId);
  
      if (!route) {
        return res.status(404).json({ 
          message: "Rota não encontrada" 
        });
      }
  
      await route.destroy();
      return res.json({ 
        message: "Rota excluída com sucesso", 
        route 
      });
  
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao excluir rota:", error);
      return res.status(500).json({ 
        message: "Erro ao excluir rota", 
        error: error.message 
      });
    }
  }
}

export default new RouteController();