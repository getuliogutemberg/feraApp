import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request, Response } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, generateUserJWTSecret } from '../utils/tokenUtils';
import emailService from '../services/emailService';

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

// Interface para solicitação de recuperação de senha
interface ForgotPasswordBody {
  email: string;
}

// Interface para redefinição de senha
interface ResetPasswordBody {
  token: string;
  newPassword: string;
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
      const jwtSecret = generateUserJWTSecret();
      
      const newUser = await User.create({ 
        name, 
        email, 
        password: hashedPassword, 
        category, 
        className, 
        status: newStatus, 
        isActive,
        jwtSecret
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

      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

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

      if (!user.jwtSecret) {
        throw new Error("Usuário sem chave JWT específica");
      }

      await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, user.jwtSecret!, (err, _decoded) => {
          if (err) reject(new Error("Refresh Token expirado!"));
          resolve(true);
        });
      });

      const newAccessToken = await generateAccessToken(user);
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

  // Método para solicitar recuperação de senha
  async forgotPassword(req: Request<{}, {}, ForgotPasswordBody>, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email é obrigatório!" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Por segurança, não revelar se o email existe
        return res.json({ message: "Se o email estiver cadastrado, você receberá instruções para recuperação." });
      }      // Gerar token de recuperação
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

      console.log('Gerando token de recuperação:', {
        email,
        token: resetToken,
        expiry: resetTokenExpiry
      });

      // Salvar token no banco
      await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry
      });

      console.log('Token salvo no banco para usuário:', user.id);

      // Enviar email
      await emailService.sendPasswordResetEmail(email, resetToken);

      return res.json({ 
        message: "Se o email estiver cadastrado, você receberá instruções para recuperação." 
      });
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao solicitar recuperação de senha:', error);
      return res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error.message 
      });
    }
  }
  // Método para redefinir senha
  async resetPassword(req: Request<{}, {}, ResetPasswordBody>, res: Response) {
    try {
      const { token, newPassword } = req.body;

      console.log('Reset password request:', { token: token ? 'presente' : 'ausente', newPassword: newPassword ? 'presente' : 'ausente' });      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token e nova senha são obrigatórios!" });
      }

      // Buscar usuário pelo token
      console.log('Procurando usuário com token:', token);
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            [require('sequelize').Op.gt]: new Date() // Token ainda válido
          }
        }
      });

      console.log('Usuário encontrado:', user ? `ID: ${user.id}` : 'Nenhum');

      if (!user) {
        // Verificar se existe usuário com o token mas expirado
        const expiredUser = await User.findOne({
          where: { resetPasswordToken: token }
        });
        
        if (expiredUser) {
          console.log('Token encontrado mas expirado para usuário:', expiredUser.id);
          return res.status(400).json({ message: "Token expirado!" });
        } else {
          console.log('Token não encontrado no banco de dados');
          return res.status(400).json({ message: "Token inválido!" });
        }
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Atualizar senha e limpar tokens de recuperação
      await user.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        refreshToken: null // Invalidar sessões existentes
      });

      return res.json({ message: "Senha redefinida com sucesso!" });
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao redefinir senha:', error);
      return res.status(500).json({ 
        message: "Erro interno do servidor",
        error: error.message 
      });
    }
  }
}

export default new AuthController();