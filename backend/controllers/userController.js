const bcrypt = require("bcryptjs");


const User = require("../models/User");

const { 
  generateUsers,
  } = require("../utils/index");

const getUsers = async (req, res) => {
  try {
    // Verifica se já existe algum usuário no banco de dados
    const existingUsers = await User.findAll();
    
    // Se não houver usuários no banco, cria-os
    if (existingUsers.length === 0) {
      const groups = ["A", "B", "C"]; // Exemplo de grupos
      const tags = ["1", "2", "3", "4"]; // Exemplo de tags

      const generatedUsers = generateUsers(groups, tags);
     

      // Insere os usuários no banco de dados
      for (const group in generatedUsers) {
        for (const user of generatedUsers[group]) {
          const newUser = new User(user);
          await newUser.save();
        }
      }

      console.log("Usuários criados com sucesso!");
    }

    // Retorna os usuários do banco de dados
    const usersFromDB = await User.findAll();
    res.status(200).json(usersFromDB);

  } catch (err) {
    console.error("Erro ao obter os usuários", err);
    res.status(500).send("Erro ao obter os usuários");
  }
};

// Criar um novo usuário
const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
};

// Atualizar usuário
const updateUser = async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.params.id } });
    const updatedUser = await User.findByPk(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
};

// Excluir usuário
const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
}
