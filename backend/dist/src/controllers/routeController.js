"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Route_1 = __importDefault(require("../models/Route"));
class RouteController {
    async getRoutes(_req, res) {
        try {
            let routes = await Route_1.default.findAll();
            if (routes.length === 0) {
                const defaultRoutes = [];
                if (defaultRoutes.length > 0) {
                    await Route_1.default.bulkCreate(defaultRoutes);
                    routes = await Route_1.default.findAll();
                    console.log("Rotas padrão inseridas com sucesso.");
                }
                return res.status(200).json(routes);
            }
            return res.status(200).json(routes);
        }
        catch (err) {
            const error = err;
            console.error("Erro ao buscar rotas:", error);
            return res.status(500).json({
                message: "Erro ao buscar rotas",
                error: error.message
            });
        }
    }
    async createRoute(req, res) {
        try {
            const { path, component, requiredRole, pageId, reportId, icon, name, workspaceId } = req.body;
            if (!path || !component) {
                return res.status(400).json({
                    message: "Path e component são campos obrigatórios"
                });
            }
            const existingRoute = await Route_1.default.findOne({ where: { path } });
            if (existingRoute) {
                return res.status(400).json({
                    message: "Já existe uma rota com este path"
                });
            }
            const newRoute = await Route_1.default.create({
                path,
                component,
                requiredRole: requiredRole || [],
                pageId: pageId || "",
                name: name || "",
                reportId: reportId || "",
                workspaceId: workspaceId || "",
                icon: icon || ""
            });
            return res.status(201).json(newRoute);
        }
        catch (err) {
            const error = err;
            console.error("Erro ao criar rota:", error);
            return res.status(500).json({
                message: "Erro ao criar rota",
                error: error.message
            });
        }
    }
    async updateRoute(req, res) {
        try {
            const { path, component, requiredRole, pageId, reportId, workspaceId, icon, name } = req.body;
            const routeId = req.params.id;
            if (!path || !component) {
                return res.status(400).json({
                    message: "Path e component são campos obrigatórios"
                });
            }
            const existingRoute = await Route_1.default.findOne({
                where: {
                    path,
                    id: { [sequelize_1.Op.not]: routeId }
                }
            });
            if (existingRoute) {
                return res.status(400).json({
                    message: "Já existe outra rota com este path"
                });
            }
            const [affectedCount] = await Route_1.default.update({
                path,
                component,
                name,
                requiredRole: requiredRole || [],
                pageId: pageId || "",
                reportId: reportId || "",
                workspaceId: workspaceId || "",
                icon: icon || ""
            }, { where: { id: routeId } });
            if (affectedCount === 0) {
                return res.status(404).json({
                    message: "Rota não encontrada"
                });
            }
            const updatedRoute = await Route_1.default.findByPk(routeId);
            return res.json(updatedRoute);
        }
        catch (err) {
            const error = err;
            console.error("Erro ao atualizar rota:", error);
            return res.status(500).json({
                message: "Erro ao atualizar rota",
                error: error.message
            });
        }
    }
    async deleteRoute(req, res) {
        try {
            const routeId = req.params.id;
            const route = await Route_1.default.findByPk(routeId);
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
        }
        catch (err) {
            const error = err;
            console.error("Erro ao excluir rota:", error);
            return res.status(500).json({
                message: "Erro ao excluir rota",
                error: error.message
            });
        }
    }
}
exports.default = new RouteController();
//# sourceMappingURL=routeController.js.map