"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCategory = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const verifyToken = async (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token)
        return res.status(401).json({ message: "Acesso negado!" });
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
            throw new Error("Token inválido");
        const user = await User_1.default.findByPk(decoded.id);
        if (!(user === null || user === void 0 ? void 0 : user.jwtSecret))
            throw new Error("Usuário não encontrado ou sem chave JWT específica");
        const verified = jsonwebtoken_1.default.verify(token, user.jwtSecret);
        req.user = verified;
        return next();
    }
    catch (err) {
        const error = err;
        return res.status(400).json({ message: "Token inválido!", error: error.message });
    }
};
exports.verifyToken = verifyToken;
const verifyCategory = (category) => {
    return (req, res, next) => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.category) !== category) {
            return res.status(403).json({ message: "Acesso negado! Permissão insuficiente." });
        }
        return next();
    };
};
exports.verifyCategory = verifyCategory;
//# sourceMappingURL=authMiddleware.js.map