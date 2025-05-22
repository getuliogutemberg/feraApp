import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User";
import { generateUsers } from "../utils/userGenerator";

dotenv.config({ path: '../.env' });

// Interface para o corpo da requisição de criação de usuário
interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  category: string;
  className: string;
}

// Interface para o corpo da requisição de atualização de senha
interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const { category } = req.query; // Obtém category da query string
      let filter: { category?: string } = {}; // Define um filtro vazio por padrão
  
      if (category) {
        filter.category = category as string; // Aplica o filtro se category for informado
      }
  
      let existingUsers = await User.findAll({ where: filter });
  
      if (existingUsers.length === 0) {
        const groups = ["A", "B", "C"];
        const tags = ["1", "2", "3", "4"];
        const generatedUsers = generateUsers(groups, tags);
  
        // Cria um array de usuários para inserção em lote
        const usersToInsert = Object.values(generatedUsers)
          .flat()
          .map(user => ({ 
            ...user, 
            className: user.className // Mantém o className do usuário gerado
          }));
        
        if (usersToInsert.length > 0) {
          await User.bulkCreate(usersToInsert);
          console.log("Usuários criados com sucesso!");
        }
  
        // Recupera os usuários recém-criados com o filtro aplicado
        existingUsers = await User.findAll({ where: filter });
      }
  
      return res.status(200).json(existingUsers);
    } catch (err) {
      const error = err as Error;
      console.error("Erro ao obter os usuários:", error.message);
      return res.status(500).json({ error: "Erro ao obter os usuários" });
    }
  }

  async createUser(req: Request<{}, {}, CreateUserBody>, res: Response) {
    const { name, email, password, category, className } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({ 
        name, 
        email, 
        password: hashedPassword,
        category,
        className,
        isActive: true 
      });
  
      return res.status(201).json(newUser);
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      await User.update(req.body, { where: { id: req.params.id } });
      const updatedUser = await User.findByPk(req.params.id);
      return res.json(updatedUser);
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ 
        message: "Erro ao atualizar usuário", 
        error: error.message 
      });
    }
  }

  async updatePassword(req: Request<{ id: string }, {}, UpdatePasswordBody>, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.params.id);
  
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
      await user.update({ password: hashedPassword });
  
      return res.json({ message: "Senha alterada com sucesso" });
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ 
        message: "Erro ao alterar senha", 
        error: error.message 
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await User.destroy({ where: { id: req.params.id } });
      return res.status(204).send();
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ 
        message: "Erro ao excluir usuário",
        error: error.message
      });
    }
  }
}

export default new UserController();