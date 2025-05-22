import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Interface para o payload do token JWT
interface UserPayload {
  id: string;
  category: string;
  [key: string]: any; // Permite outras propriedades adicionais
}

// Extendendo a interface Request do Express para incluir a propriedade user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Middleware para verificar token JWT
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const decoded = jwt.decode(token) as UserPayload;
    if (!decoded?.id) throw new Error("Token inválido");

    const user = await User.findByPk(decoded.id);
    if (!user?.jwtSecret) throw new Error("Usuário não encontrado ou sem chave JWT específica");

    const verified = jwt.verify(token, user.jwtSecret) as UserPayload;
    req.user = verified;
    return next();
  } catch (err) {
    const error = err as Error;
    return res.status(400).json({ message: "Token inválido!", error: error.message });
  }
};

// Middleware para verificar categoria
export const verifyCategory = (category: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.category !== category) {
      return res.status(403).json({ message: "Acesso negado! Permissão insuficiente." });
    }
    return next();
  };
};