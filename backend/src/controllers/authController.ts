import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';

// Interface para o corpo da requisição de registro
interface RegisterBody {
  name: string;
  email: string;
  password: string;
  category: string;
  className: string;
  status?: string;
}

// Interface para o corpo da requisição de login
interface LoginBody {
  email: string;
  password: string;
}

// Interface para o corpo da requisição de refresh token
interface RefreshBody {
  refreshToken: string;
}

class AuthController {
  async register(req: Request<{}, {}, RegisterBody>, res: Response) {
    try {
      const { name, email, password, category, className, status } = req.body;
      
      if (!name || !email || !password || !category || !className) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
      }

      const userExists = await User.findOne({ where: { email } });
      if (userExists) return res.status(400).json({ message: "Email já cadastrado!" });

      const newStatus = status === "cadastro" ? "" : "pedido de acesso";
      const isActive = status === "cadastro" ? true : false;
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const newUser = await User.create({ 
        name, 
        email, 
        password: hashedPassword, 
        category, 
        className, 
        status: newStatus, 
        isActive 
      });

      return res.status(201).json({ 
        message: `${status === "cadastro" ? 'Usuário registrado com sucesso!' : 'Registro solicitado'}`,
        ...(status === "cadastro" && { user: newUser })
      });
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ message: "Erro no servidor!", error: error.message });
    }
  }

  async login(req: Request<{}, {}, LoginBody>, res: Response) {
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

      await user.update({ refreshToken });

      return res.json({ 
        message: "Login bem-sucedido!", 
        accessToken, 
        refreshToken, 
        route: '/',
        user 
      });
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ message: "Erro no servidor!", error: error.message });
    }
  }

  async refresh(req: Request<{}, {}, RefreshBody>, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ message: "Token de atualização obrigatório!" });

      const user = await User.findOne({ where: { refreshToken } });
      if (!user) return res.status(403).json({ message: "Refresh Token inválido!" });

      await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err, _decoded) => {
          if (err) reject(new Error("Refresh Token expirado!"));
          resolve(true);
        });
      });

      const newAccessToken = generateAccessToken(user);
      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      const error = err as Error;
      return res.status(403).json({ message: error.message || "Erro no servidor!" });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await User.update({ refreshToken: null }, { where: { id: req.user?.id } });
      return res.json({ message: "Logout bem-sucedido!" });
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({ message: "Erro no servidor!", error: error.message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.user?.id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado!" });
      }

      const userObj = user.get({ plain: true });
      const { password, ...userWithoutPassword } = userObj;

      return res.json(userWithoutPassword);
    } catch (err) {
      const error = err as Error;
      console.error(error);
      return res.status(500).json({
        message: "Erro no servidor!",
        error: error.message || "Erro desconhecido",
      });
    }
  }

  async admin(_req: Request, res: Response) {
    return res.json({ message: "Acesso permitido ao administrador!" });
  }
}

export default new AuthController();