const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const { generateAccessToken, generateRefreshToken, } = require("../utils/tokenUtils");

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, category, className,status } = req.body;
      if (!name || !email || !password || !category || !className) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
      }
  
      const userExists = await User.findOne({ where: { email } });
      if (userExists) return res.status(400).json({ message: "Email já cadastrado!" });
      const newStatus = status === "cadastro" ? "" : "pedido de acesso"; 
      const isActive = status === "cadastro" ? true : false; 
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, email, password: hashedPassword, category, className, status: newStatus,isActive });
      await newUser.save();
  
      res.status(201).json({ message: `${status === "cadastro" ? 'Usuário registrado com sucesso!' : 'Registro solicitado' }` + (status === "cadastro" && " " + JSON.stringify(newUser)) });
    } catch (err) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async login(req, res) {
 
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios!" });
      }
  
      const user = await User.findOne({ where: { email } });
      
      if (!user) return res.status(400).json({ message: "Usuário não encontrado!" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Senha incorreta!" });
  
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      user.refreshToken = refreshToken;
      // console.log(user)
      await user.save();
  
      res.json({ message: "Login bem-sucedido!", accessToken, refreshToken, route:'/',user });
    } catch (err) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ message: "Token de atualização obrigatório!" });
  
      const user = await User.findOne({ refreshToken });
      if (!user) return res.status(403).json({ message: "Refresh Token inválido!" });
  
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Refresh Token expirado!" });
  
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
      });
    } catch (err) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
      res.json({ message: "Logout bem-sucedido!" });
    } catch (err) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async me(req, res) {
    try {
      // Busca o usuário pelo id que vem do token
      const user = await User.findByPk(req.user.id);
     
      // Verifica se o usuário foi encontrado
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado!" });
      }
  
      // Remove o campo password manualmente
      const userObj = user.get({ plain: true });
      delete userObj.password;
  
      // Retorna o usuário sem a senha
      res.json(userObj);
    } catch (err) {
      console.error(err); // Registra o erro no console para depuração
  
      // Resposta de erro com status 500
      res.status(500).json({
        message: "Erro no servidor!",
        error: err.message || "Erro desconhecido",
      });
    }
  }

  async admin(req, res) {
    res.json({ message: "Acesso permitido ao administrador!" });
  }
}

module.exports = new AuthController();