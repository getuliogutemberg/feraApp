"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Menu_1 = __importDefault(require("../models/Menu"));
const Route_1 = __importDefault(require("../models/Route"));
class MenuController {
    async getMenus_(_req, res) {
        try {
            let routes = await Route_1.default.findAll();
            let menus = [
                {
                    id: "2",
                    name: "Diagnóstico",
                    icon: "chartLine",
                    component: 'MenuGroup',
                    path: "/diagnóstico",
                    subRoutes: routes.filter((route) => ["RCP", "CAPEX", "Manutenção"].includes(route.name)),
                    requiredRole: ["OWNER", "ADMIN", "CLIENT"],
                },
                {
                    id: "3",
                    name: "Análise de Criticidade",
                    icon: "listFilter",
                    component: 'MenuGroup',
                    path: "/criticidade",
                    subRoutes: routes.filter((route) => ["Interrupções", "Energia não Distribuída", "DEC/FEC"].includes(route.name)),
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
                    subRoutes: routes.filter((route) => ["Projeção de RUL", "Projeção de Manutenção"].includes(route.name)),
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
            ];
            return res.status(200).json(menus);
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
    async getMenus(_req, res) {
        try {
            const menus = await Menu_1.default.findAll();
            return res.status(200).json(menus);
        }
        catch (err) {
            const error = err;
            console.error("Erro ao buscar menus:", error);
            return res.status(500).json({
                message: "Erro ao buscar menus",
                error: error.message
            });
        }
    }
    async createMenu(req, res) {
        try {
            const { menuGroups } = req.body;
            await Menu_1.default.destroy({
                where: {},
                truncate: true
            });
            await Menu_1.default.bulkCreate(menuGroups);
            return res.status(200).json({ message: "Menus atualizados com sucesso" });
        }
        catch (err) {
            const error = err;
            console.error("Erro ao salvar menus:", error);
            return res.status(500).json({
                message: "Erro ao salvar menus",
                error: error.message
            });
        }
    }
}
exports.default = new MenuController();
//# sourceMappingURL=menuController.js.map