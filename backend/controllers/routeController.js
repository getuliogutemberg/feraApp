const Route = require("../models/Route"); 

class RouteController {
    getRoutes = async (req, res) => {
        try {
          // Verifica se já existem rotas no banco
          let routes = await Route.findAll();
      
          // Se não houver rotas, cria as rotas padrão
          if (routes.length === 0) {
            const defaultRoutes = [
              // Adicione aqui as rotas padrão se necessário
            ];
      
            // Insere as rotas padrão no banco de dados
            if (defaultRoutes.length > 0) {
              await Route.bulkCreate(defaultRoutes);
              routes = await Route.findAll();
              console.log("Rotas padrão inseridas com sucesso.");
            }
            return res.status(200).json(routes); // Retorna as rotas padrão para o cliente
          }
      
          // Caso existam rotas, retorna elas para o cliente
          res.status(200).json(routes);
        } catch (err) {
          console.error("Erro ao buscar rotas:", err);
          res.status(500).json({ message: "Erro ao buscar rotas", error: err.message });
        }
    };

    createRoute = async (req, res) => {
        try {
          const { path, component, requiredRole, pageId,reportId ,icon,name,workspaceId} = req.body;
      
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
          const newRoute = new Route({
            path,
            component,
            requiredRole: requiredRole || [], // Se não for fornecido, usa array vazio
            pageId: pageId || "",
            name: name || "",
            reportId: reportId || "", // Se não for fornecido, usa string vazia
            workspaceId: workspaceId || "",
            icon: icon || "", // Se não for fornecido, usa string vazia
          });
      
          // Salva a nova rota no banco de dados
          const savedRoute = await newRoute.save();
      
          // Retorna a rota criada
          res.status(201).json(savedRoute);
      
        } catch (err) {
          console.error("Erro ao criar rota:", err);
          res.status(500).json({ 
            message: "Erro ao criar rota", 
            error: err.message 
          });
        }
    };

    updateRoute = async (req, res) => {
      try {
        const { path, component, requiredRole, pageId,reportId,workspaceId,icon,name } = req.body;
        const routeId = req.params.id;
    
        // Validações básicas
        if (!path || !component) {
          return res.status(400).json({ 
            message: "Path e component são campos obrigatórios" 
          });
        }
    
        // Verifica se existe uma rota com o mesmo path (exceto a própria rota)
        const existingRoute = await Route.findOne({ 
          where: { path, id: { [Op.ne]: routeId } }
        });
        
        if (existingRoute) {
          return res.status(400).json({ 
            message: "Já existe outra rota com este path" 
          });
        }
    
        // Atualiza a rota
        const updatedRoute = await Route.update(
          {
            path,
            component,
            name,
            requiredRole: requiredRole || [],
            pageId: pageId || "",
            reportId: reportId || "",
            workspaceId : workspaceId || "",
            icon : icon || ""
          },
          { where: { id: routeId } }
        );
    
        if (updatedRoute[0] === 0) {
          return res.status(404).json({ 
            message: "Rota não encontrada" 
          });
        }
    
        const updatedRouteResult = await Route.findByPk(routeId);
        res.json(updatedRouteResult);
    
      } catch (err) {
        console.error("Erro ao atualizar rota:", err);
        res.status(500).json({ 
          message: "Erro ao atualizar rota", 
          error: err.message 
        });
      }
    };

    deleteRoute = async (req, res) => {
        try {
          const routeId = req.params.id;
          const deletedRoute = await Route.findByPk(routeId);
      
          if (!deletedRoute) {
            return res.status(404).json({ 
              message: "Rota não encontrada" 
            });
          }
      
          await deletedRoute.destroy();
          res.json({ 
            message: "Rota excluída com sucesso", 
            route: deletedRoute 
          });
      
        } catch (err) {
          console.error("Erro ao excluir rota:", err);
          res.status(500).json({ 
            message: "Erro ao excluir rota", 
            error: err.message 
          });
        }
    };
}

module.exports = new RouteController();