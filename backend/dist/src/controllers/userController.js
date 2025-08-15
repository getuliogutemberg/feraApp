"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const userGenerator_1 = require("../utils/userGenerator");
dotenv_1.default.config({ path: '../.env' });
class UserController {
    async getUsers(req, res) {
        try {
            const { category } = req.query;
            let filter = {};
            if (category) {
                filter.category = category;
            }
            let existingUsers = await User_1.default.findAll({ where: filter });
            if (existingUsers.length === 0) {
                const groups = ["A", "B", "C"];
                const tags = ["1", "2", "3", "4"];
                const generatedUsers = (0, userGenerator_1.generateUsers)(groups, tags);
                const usersToInsert = Object.values(generatedUsers)
                    .flat()
                    .map(user => ({
                    ...user,
                    className: user.className
                }));
                if (usersToInsert.length > 0) {
                    await User_1.default.bulkCreate(usersToInsert);
                    console.log("Usuários criados com sucesso!");
                }
                existingUsers = await User_1.default.findAll({ where: filter });
            }
            return res.status(200).json(existingUsers);
        }
        catch (err) {
            const error = err;
            console.error("Erro ao obter os usuários:", error.message);
            return res.status(500).json({ error: "Erro ao obter os usuários" });
        }
    }
    async createUser(req, res) {
        const { name, email, password, category, className } = req.body;
        try {
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const newUser = await User_1.default.create({
                name,
                email,
                password: hashedPassword,
                category,
                className,
                isActive: true
            });
            return res.status(201).json(newUser);
        }
        catch (err) {
            const error = err;
            return res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            await User_1.default.update(req.body, { where: { id: req.params.id } });
            const updatedUser = await User_1.default.findByPk(req.params.id);
            return res.json(updatedUser);
        }
        catch (err) {
            const error = err;
            return res.status(500).json({
                message: "Erro ao atualizar usuário",
                error: error.message
            });
        }
    }
    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User_1.default.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Senha atual incorreta" });
            }
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
            await user.update({ password: hashedPassword });
            return res.json({ message: "Senha alterada com sucesso" });
        }
        catch (err) {
            const error = err;
            return res.status(500).json({
                message: "Erro ao alterar senha",
                error: error.message
            });
        }
    }
    async deleteUser(req, res) {
        try {
            await User_1.default.destroy({ where: { id: req.params.id } });
            return res.status(204).send();
        }
        catch (err) {
            const error = err;
            return res.status(500).json({
                message: "Erro ao excluir usuário",
                error: error.message
            });
        }
    }
}
exports.default = new UserController();
//# sourceMappingURL=userController.js.map