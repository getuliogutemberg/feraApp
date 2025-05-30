import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response, NextFunction } from "express";
import sequelize from "../config/database";
import { verifyToken, verifyCategory } from "./middleware/authMiddleware";
import cors from "cors";
import http from "http";
import { Server } from "http";
import AuthController from "./controllers/authController";
import UserController from "./controllers/userController";
import RouteController from "./controllers/routeController";
import MenuController from "./controllers/menuController";
import PBIController from "./controllers/pbiController";
import ConfigurationController from "./controllers/configurationController";
import AlertController from "./controllers/alertController";
import GroupDictionaryController from "./controllers/groupDictionaryController";
import MaterialsController from "./controllers/materialsController";
import ParamsController from "./controllers/paramsController"; 
import { setupSocket } from "./socket";

sequelize.authenticate()
  .then(() => console.log("Banco de dados conectado"))
  .catch((err: Error) => console.log("Erro ao conectar ao banco de dados:", err));

const app: Express = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  allowedHeaders: '*', 
  methods: '*',
  origin: '*', // Insira o endereço do frontend aqui
}));

app.use(express.static('public'));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  return next();
});

// Rota de autenticação
app.post("/register", AuthController.register); // Rota de registro
app.post("/login", AuthController.login); // Rota de login
app.post("/refresh", AuthController.refresh); // Rota para renovar o token de acesso
app.post("/logout", verifyToken, AuthController.logout); // Logout - Remove o refreshToken do usuário
app.post("/forgot-password", AuthController.forgotPassword); // Solicitar recuperação de senha
app.post("/reset-password", AuthController.resetPassword); // Redefinir senha
app.get("/me", verifyToken, AuthController.me); // Rota protegida de exemplo
app.get("/admin", verifyToken, verifyCategory("admin"), AuthController.admin); // Rota exclusiva para administradores

// Rota de usuario
app.get('/users', UserController.getUsers); // Endpoint para pegar os residentes
app.post("/users", UserController.createUser); // Criar um novo usuário
app.put("/users/:id", UserController.updateUser); // Atualizar usuário
app.put("/users/:id/password", UserController.updatePassword); // Atualizar senha do usuário
app.delete("/users/:id", UserController.deleteUser); // Excluir usuário

// Rota de rotas
app.get("/routes", RouteController.getRoutes); // Endpoint para obter as rotas
app.post("/routes", RouteController.createRoute); // Rota POST para criar novas rotas
app.put("/routes/:id", RouteController.updateRoute); // Rota PUT para atualizar rotas existentes
app.delete("/routes/:id", RouteController.deleteRoute); // Rota DELETE para excluir rotas

// Rota de Menus
app.get("/menu-groups",MenuController.getMenus)
app.post("/menu-groups",MenuController.createMenu)
// app.put("/menu-groups", MenuController.updateMenu)
// app.delete("/menu-groups", MenuController.deleteMenu)


// Rota de PBI Token
app.get("/getPBIToken/:pageId/:reportId/:workspaceId", PBIController.getPBIToken);

// Rota de configuração
app.get("/configuration", ConfigurationController.getConfiguration); // Rota para listar configurações
app.put("/configuration", ConfigurationController.updateConfiguration); // Rota para atualizar configurações

// Rota de alertas
app.get('/alerts', AlertController.getAllAlerts); // Rota para listar alertas
app.post('/alerts', AlertController.createAlert); // Rota para criar um novo alerta
app.put('/alerts/:id', AlertController.updateAlert); // Rota para atualizar um alerta
app.delete('/alerts/:id', AlertController.deleteAlert); // Rota para excluir um alerta

// Rota de grupos
app.get('/groupDictionary', GroupDictionaryController.getGroupDictionaries); // Rota para listar todos os grupos de materiais
app.get('/materials/:cod_grupo', MaterialsController.getMaterialByGroup); // Rota para listar todos os materiais de um grupo

// Rotas de parâmetros estratégicos
app.get('/params/group/:groupId', ParamsController.getGroupParams); // Rota para listar todos os parâmetros de um grupo
app.get('/params/material/:materialId', ParamsController.getMaterialParams); // Rota para listar todos os parâmetros de um grupo
app.put('/params/group/:groupId', ParamsController.updateGroupParams); // Rota para listar todos os parâmetros de um grupo
app.put('/params/material/:materialId', ParamsController.updateMaterialParams); // Rota para listar todos os parâmetros de um grupo
app.put('/params/reset/group/:groupId', ParamsController.resetGroupItems); // Rota restaurão padrão de estrategia de todos os itens de um grupo
app.put('/params/reset/material/:materialId', ParamsController.resetItem); // Rota restaurar padrão de estrategia de um item de um grupo

const server: Server = http.createServer(app);

const startServer = async (port: number): Promise<void> => {
  try {
    await new Promise((resolve, reject) => {
      server.listen(port, () => {
        console.log("Servidor rodando na porta", port);
        resolve(true);
      }).on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Porta ${port} em uso, tentando porta ${port + 1}`);
          resolve(startServer(port + 1));
        } else {
          reject(err);
        }
      });
    });
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
    process.exit(1);
  }
};

// Inicializa socket
setupSocket(server);

// Inicia o servidor
startServer(Number(process.env.PORT) || 5000);