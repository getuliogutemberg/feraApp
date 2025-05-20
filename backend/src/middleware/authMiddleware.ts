import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded;  // Define o usuário no request com os dados do token
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