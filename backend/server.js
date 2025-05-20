require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");
const { verifyToken, verifyCategory } = require('./middleware/authMiddleware');
const cors = require("cors");
const http = require("http");
const AuthController = require("./controllers/authController");
const UserController = require("./controllers/userController");
const RouteController = require("./controllers/routeController");
const PBIController = require("./controllers/pbiController");
const ConfigurationController = require("./controllers/configurationController");
const AlertController = require("./controllers/alertController");
const GroupDictionaryController = require("./controllers/groupDictionaryController");
const MaterialController = require("./controllers/materialsController"); 
const ParamsController = require("./controllers/paramsController"); 
const { setupSocket } = require("./socket");

sequelize.authenticate()
.then(() => console.log("Banco de dados conectado"))
.catch((err) => console.log("Erro ao conectar ao banco de dados:", err));

const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  allowedHeaders: '*', 
  methods: '*',
  origin: '*', // Insira o endereço do frontend aqui
}));

app.use(express.static('public'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Responde manualmente às requisições OPTIONS
  }

  next();
});

// Rota de autenticação
app.post("/register", AuthController.register); // Rota de registro
app.post("/login", AuthController.login); // Rota de login
app.post("/refresh", AuthController.refresh); // Rota para renovar o token de acesso
app.post("/logout", verifyToken, AuthController.logout); // Logout - Remove o refreshToken do usuário
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
app.get('/materials/:cod_grupo', MaterialController.getMaterialByGroup); // Rota para listar todos os materiais de um grupo

// Rotas de parâmetros estratégicos
app.get('/params/group/:groupId', ParamsController.getGroupParams); // Rota para listar todos os parâmetros de um grupo
app.get('/params/material/:materialId', ParamsController.getMaterialParams); // Rota para listar todos os parâmetros de um grupo
app.put('/params/group/:groupId', ParamsController.updateGroupParams); // Rota para listar todos os parâmetros de um grupo
app.put('/params/material/:materialId', ParamsController.updateMaterialParams); // Rota para listar todos os parâmetros de um grupo
app.put('/params/reset/group/:groupId', ParamsController.resetGroupItems); // Rota restaurão padrão de estrategia de todos os itens de um grupo
app.put('/params/reset/material/:materialId', ParamsController.resetItem); // Rota restaurar padrão de estrategia de um item de um grupo

const server = http.createServer(app);

server.listen(process.env.PORT || 5000, () => {
  console.log("Servidor rodando na porta", process.env.PORT || 5000);
});

// Inicializa socket
setupSocket(server);
