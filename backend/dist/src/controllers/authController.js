"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const tokenUtils_1 = require("../utils/tokenUtils");
const emailService_1 = __importDefault(require("../services/emailService"));
class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, category, className, status } = req.body;
            if (!name || !email || !password || !category || !className) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
            }
            const userExists = await User_1.default.findOne({ where: { email } });
            if (userExists)
                return res.status(400).json({ message: "Email já cadastrado!" });
            const newStatus = status === "cadastro" ? "" : "pedido de acesso";
            const isActive = status === "cadastro" ? true : false;
            const hashedPassword = await bcrypt_1.default.hash(password, 12);
            const jwtSecret = (0, tokenUtils_1.generateUserJWTSecret)();
            const newUser = await User_1.default.create({
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
        }
        catch (err) {
            const error = err;
            return res.status(500).json({ message: "Erro no servidor!", error: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email e senha são obrigatórios!" });
            }
            const user = await User_1.default.findOne({ where: { email } });
            if (!user)
                return res.status(400).json({ message: "Usuário não encontrado!" });
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ message: "Senha incorreta!" });
            const accessToken = await (0, tokenUtils_1.generateAccessToken)(user);
            const refreshToken = await (0, tokenUtils_1.generateRefreshToken)(user);
            await user.update({ refreshToken });
            return res.json({
                message: "Login bem-sucedido!",
                accessToken,
                refreshToken,
                route: '/',
                user
            });
        }
        catch (err) {
            const error = err;
            return res.status(500).json({ message: "Erro no servidor!", error: error.message });
        }
    }
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                return res.status(401).json({ message: "Token de atualização obrigatório!" });
            const user = await User_1.default.findOne({ where: { refreshToken } });
            if (!user)
                return res.status(403).json({ message: "Refresh Token inválido!" });
            if (!user.jwtSecret) {
                throw new Error("Usuário sem chave JWT específica");
            }
            await new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(refreshToken, user.jwtSecret, (err, _decoded) => {
                    if (err)
                        reject(new Error("Refresh Token expirado!"));
                    resolve(true);
                });
            });
            const newAccessToken = await (0, tokenUtils_1.generateAccessToken)(user);
            return res.json({ accessToken: newAccessToken });
        }
        catch (err) {
            const error = err;
            return res.status(403).json({ message: error.message || "Erro no servidor!" });
        }
    }
    async logout(req, res) {
        var _a;
        try {
            await User_1.default.update({ refreshToken: null }, { where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } });
            return res.json({ message: "Logout bem-sucedido!" });
        }
        catch (err) {
            const error = err;
            return res.status(500).json({ message: "Erro no servidor!", error: error.message });
        }
    }
    async me(req, res) {
        var _a;
        try {
            const user = await User_1.default.findByPk((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado!" });
            }
            const userObj = user.get({ plain: true });
            const { password, ...userWithoutPassword } = userObj;
            return res.json(userWithoutPassword);
        }
        catch (err) {
            const error = err;
            console.error(error);
            return res.status(500).json({
                message: "Erro no servidor!",
                error: error.message || "Erro desconhecido",
            });
        }
    }
    async admin(_req, res) {
        return res.json({ message: "Acesso permitido ao administrador!" });
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email é obrigatório!" });
            }
            const user = await User_1.default.findOne({ where: { email } });
            if (!user) {
                return res.json({ message: "Se o email estiver cadastrado, você receberá instruções para recuperação." });
            }
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            const resetTokenExpiry = new Date(Date.now() + 3600000);
            await user.update({
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetTokenExpiry
            });
            await emailService_1.default.sendPasswordResetEmail(email, resetToken);
            return res.json({
                message: "Se o email estiver cadastrado, você receberá instruções para recuperação."
            });
        }
        catch (err) {
            const error = err;
            console.error('Erro ao solicitar recuperação de senha:', error);
            return res.status(500).json({
                message: "Erro interno do servidor",
                error: error.message
            });
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return res.status(400).json({ message: "Token e nova senha são obrigatórios!" });
            }
            const user = await User_1.default.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: {
                        [require('sequelize').Op.gt]: new Date()
                    }
                }
            });
            if (!user) {
                const expiredUser = await User_1.default.findOne({
                    where: { resetPasswordToken: token }
                });
                if (expiredUser) {
                    return res.status(400).json({ message: "Token expirado!" });
                }
                else {
                    return res.status(400).json({ message: "Token inválido!" });
                }
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 12);
            await user.update({
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
                refreshToken: null
            });
            return res.json({ message: "Senha redefinida com sucesso!" });
        }
        catch (err) {
            const error = err;
            console.error('Erro ao redefinir senha:', error);
            return res.status(500).json({
                message: "Erro interno do servidor",
                error: error.message
            });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map