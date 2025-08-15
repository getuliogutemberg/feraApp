"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = exports.generateUserJWTSecret = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const generateUserJWTSecret = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
exports.generateUserJWTSecret = generateUserJWTSecret;
const ensureUserJWTSecret = async (user) => {
    if (!user.jwtSecret) {
        const newSecret = (0, exports.generateUserJWTSecret)();
        await User_1.default.update({ jwtSecret: newSecret }, { where: { id: user.id } });
        return newSecret;
    }
    return user.jwtSecret;
};
const generateAccessToken = async (user) => {
    const secret = await ensureUserJWTSecret(user);
    const payload = {
        id: String(user.id),
        ...(user.category && { category: user.category }),
        ...(user.className && { className: user.className })
    };
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "15m" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = async (user) => {
    const secret = await ensureUserJWTSecret(user);
    return jsonwebtoken_1.default.sign({ id: user.id }, secret, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=tokenUtils.js.map