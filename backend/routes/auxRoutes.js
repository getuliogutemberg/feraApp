const express = require("express");
const { verifyToken, verifyCategory } = require("../middleware/authMiddleware");
const  Route  = require("../models/Route");
const  User  = require("../models/User");

const router = express.Router();

router.get("/me",verifyToken,  async (req, res) => {
    try {
      // Busca o usuário pelo id que vem do token
      const user = await User.findById(req.user.id).select("-password");
     
      // Verifica se o usuário foi encontrado
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado!" });
      }
  
      // Retorna o usuário sem a senha
      res.json(user);
    } catch (err) {
      console.error(err); // Registra o erro no console para depuração
  
      // Resposta de erro com status 500
      res.status(500).json({
        message: "Erro no servidor!",
        error: err.message || "Erro desconhecido",
      });
    }
  });
router.get("/admin", verifyToken, verifyCategory("admin"), (req, res) => {
    res.json({ message: "Acesso permitido ao administrador!" });
  });
router.get("/routes", async (req, res) => {
  try {
    // Verifica se já existem rotas no banco
    const routes = await Route.find();

    // Se não houver rotas, cria as rotas padrão
    if (routes.length === 0) {
      const defaultRoutes = [
        // {
        //   path: "/indicadores",
        //   component: `<ProtectedRoute><DashPBI pageId="d7d35c6daec9e7e50737" /></ProtectedRoute>`,
        //   requiredRole: ["admin", "user"], // Exemplo de roles que podem acessar
        //   pageId: "d7d35c6daec9e7e50737"
        // },
        // {
        //   path: "/gestão",
        //   component: `<ProtectedRoute><DashPBI pageId="4582490ac83feb518640" /></ProtectedRoute>`,
        //   requiredRole: ["admin", "manager"], // Exemplo de roles que podem acessar
        //   pageId: "4582490ac83feb518640"
        // }
      ];

      // Insere as rotas padrão no banco de dados
      await Route.insertMany(defaultRoutes);
      routes = await Route.find();
      console.log("Rotas padrão inseridas com sucesso.");
      return res.status(200).json(routes); // Retorna as rotas padrão para o cliente
    }

    // Caso existam rotas, retorna elas para o cliente
    res.status(200).json(routes);
  } catch (err) {
    console.error("Erro ao buscar rotas:", err);
    res.status(500).json({ message: "Erro ao buscar rotas", error: err.message });
  }
});
router.get("/getPBIToken/:pageId", async (req, res) => {
  const pageId = req.params.pageId
  try {
    const response = await msalClient.acquireTokenByClientCredential({
      scopes: ["https://analysis.windows.net/powerbi/api/.default"],
    });
    
    if (!response || !response.accessToken) {
      throw new Error("Falha ao obter token de acesso");
    }


    
    const reportDetails = await getReportDetails(response.accessToken);
    const embedTokenResponse = await generateEmbedToken(response.accessToken, reportDetails.datasetId);
    
    res.status(200).json({
      accessToken: embedTokenResponse.token,
      embedUrl: reportDetails.embedUrl,
      expiry: embedTokenResponse.expiration,
      pageId: pageId,
    });
  } catch (error) {
    console.error("Erro ao adquirir token:", error);
    res.status(500).json({ error: "Falha ao adquirir token", details: error.message });
  }
});

module.exports = router;






