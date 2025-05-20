require("dotenv").config({ path: '../.env' });
const bcrypt = require("bcryptjs");
const User = require("../models/User"); 
const { generateUsers } = require("../utils/userGenerator");

class UserController {
  async getUsers(req, res) {
    try {
      const { category } = req.query; // Obtém className da query string
      let filter = {}; // Define um filtro vazio por padrão
  
      if (category) {
        filter.category = category; // Aplica o filtro se className for informado
      }
  
      let existingUsers = await User.findAll({ where: filter });
  
      if (existingUsers.length === 0) {
        const groups = ["A", "B", "C"];
        const tags = ["1", "2", "3", "4"];
        const generatedUsers = generateUsers(groups, tags);
  
        // Cria um array de usuários para inserção em lote
        const usersToInsert = Object.values(generatedUsers)
          .flat()
          .map(user => ({ ...user, className })); // Adiciona className aos novos usuários
        
        if (usersToInsert.length > 0) {
          await User.insertMany(usersToInsert);
          console.log("Usuários criados com sucesso!");
        }
  
        // Recupera os usuários recém-criados com o filtro aplicado
        existingUsers = await User.findAll({ where: filter });
      }
  
      res.status(200).json(existingUsers);
    } catch (err) {
      console.error("Erro ao obter os usuários:", err.message);
      res.status(500).json({ error: "Erro ao obter os usuários" });
    }
  }

  async createUser(req, res) {
    const { name, email, password,category,className } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const newUser = new User({ name, email, password:hashedPassword,category:category,className: className ,isActive: true });
  
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ message: "Erro ao criar usuário" });
    }
  }

  async updateUser(req, res) {
    try {
      await User.update(req.body, { where: { id: req.params.id } });
      const updatedUser = await User.findByPk(req.params.id);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }

  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
  
      // Verifica se a senha atual está correta
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }
  
      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: "Senha alterada com sucesso" });
    } catch (err) {
      res.status(500).json({ message: "Erro ao alterar senha", error: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Erro ao excluir usuário" });
    }
  }
}

module.exports = new UserController();