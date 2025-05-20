import jwt from "jsonwebtoken";
import { UserAttributes } from "../models/User";

// Interface para o payload do token de acesso
interface AccessTokenPayload {
  id: string;
  category?: string;
  className?: string;
}

// Função para gerar token de acesso
export const generateAccessToken = (user: UserAttributes): string => {
  const payload: AccessTokenPayload = {
    id: String(user.id),
    ...(user.category && { category: user.category }),
    ...(user.className && { className: user.className })
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
};

// Função para gerar token de refresh
export const generateRefreshToken = (user: UserAttributes): string => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
};