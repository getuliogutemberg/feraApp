"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../config/database"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const authController_1 = __importDefault(require("./controllers/authController"));
const userController_1 = __importDefault(require("./controllers/userController"));
const routeController_1 = __importDefault(require("./controllers/routeController"));
const menuController_1 = __importDefault(require("./controllers/menuController"));
const pbiController_1 = __importDefault(require("./controllers/pbiController"));
const configurationController_1 = __importDefault(require("./controllers/configurationController"));
const alertController_1 = __importDefault(require("./controllers/alertController"));
const groupDictionaryController_1 = __importDefault(require("./controllers/groupDictionaryController"));
const materialsController_1 = __importDefault(require("./controllers/materialsController"));
const paramsController_1 = __importDefault(require("./controllers/paramsController"));
const socket_1 = require("./socket");
const equipamentoManut_1 = __importDefault(require("./routes/equipamentoManut"));
const adminDatabase_1 = __importDefault(require("./routes/adminDatabase"));
database_1.default.authenticate()
    .then(() => console.log("Banco de dados conectado"))
    .catch((err) => console.log("Erro ao conectar ao banco de dados:", err));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    allowedHeaders: '*',
    methods: '*',
    origin: '*',
}));
app.use(express_1.default.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    return next();
});
app.post("/register", authController_1.default.register);
app.post("/login", authController_1.default.login);
app.post("/refresh", authController_1.default.refresh);
app.post("/logout", authMiddleware_1.verifyToken, authController_1.default.logout);
app.post("/forgot-password", authController_1.default.forgotPassword);
app.post("/reset-password", authController_1.default.resetPassword);
app.get("/me", authMiddleware_1.verifyToken, authController_1.default.me);
app.get("/admin", authMiddleware_1.verifyToken, (0, authMiddleware_1.verifyCategory)("admin"), authController_1.default.admin);
app.get('/users', userController_1.default.getUsers);
app.post("/users", userController_1.default.createUser);
app.put("/users/:id", userController_1.default.updateUser);
app.put("/users/:id/password", userController_1.default.updatePassword);
app.delete("/users/:id", userController_1.default.deleteUser);
app.get("/routes", routeController_1.default.getRoutes);
app.post("/routes", routeController_1.default.createRoute);
app.put("/routes/:id", routeController_1.default.updateRoute);
app.delete("/routes/:id", routeController_1.default.deleteRoute);
app.get("/menu-groups", menuController_1.default.getMenus);
app.post("/menu-groups", menuController_1.default.createMenu);
app.get("/getPBIToken/:pageId/:reportId/:workspaceId", pbiController_1.default.getPBIToken);
app.get("/configuration", configurationController_1.default.getConfiguration);
app.put("/configuration", configurationController_1.default.updateConfiguration);
app.get('/alerts', alertController_1.default.getAllAlerts);
app.post('/alerts', alertController_1.default.createAlert);
app.put('/alerts/:id', alertController_1.default.updateAlert);
app.delete('/alerts/:id', alertController_1.default.deleteAlert);
app.get('/groupDictionary', groupDictionaryController_1.default.getGroupDictionaries);
app.get('/materials/:cod_grupo', materialsController_1.default.getMaterialByGroup);
app.get('/params/group/:groupId', paramsController_1.default.getGroupParams);
app.get('/params/material/:materialId', paramsController_1.default.getMaterialParams);
app.put('/params/group/:groupId', paramsController_1.default.updateGroupParams);
app.put('/params/material/:materialId', paramsController_1.default.updateMaterialParams);
app.put('/params/reset/group/:groupId', paramsController_1.default.resetGroupItems);
app.put('/params/reset/material/:materialId', paramsController_1.default.resetItem);
app.use('/equipamentos-manut', equipamentoManut_1.default);
app.use('/api/admin/database', adminDatabase_1.default);
const server = http_1.default.createServer(app);
const startServer = async (port) => {
    try {
        await new Promise((resolve, reject) => {
            server.listen(port, () => {
                console.log("Servidor rodando na porta", port);
                resolve(true);
            }).on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Porta ${port} em uso, tentando porta ${port + 1}`);
                    resolve(startServer(port + 1));
                }
                else {
                    reject(err);
                }
            });
        });
    }
    catch (err) {
        console.error("Erro ao iniciar servidor:", err);
        process.exit(1);
    }
};
(0, socket_1.setupSocket)(server);
startServer(Number(process.env.PORT) || 5000);
//# sourceMappingURL=server.js.map