"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Alert_1 = __importDefault(require("../models/Alert"));
class AlertController {
    async getAllAlerts(_req, res) {
        try {
            const alerts = await Alert_1.default.findAll({
                where: { deletedAt: null }
            });
            return res.json(alerts);
        }
        catch (error) {
            const err = error;
            return res.status(500).json({ message: err.message });
        }
    }
    async createAlert(req, res) {
        const { type, title, description, color, icon } = req.body;
        try {
            const newAlert = await Alert_1.default.create({
                type,
                title,
                description,
                color,
                icon
            });
            return res.status(201).json(newAlert);
        }
        catch (error) {
            const err = error;
            return res.status(400).json({ message: err.message });
        }
    }
    async updateAlert(req, res) {
        try {
            const { id } = req.params;
            const { type, title, description, color, icon } = req.body;
            const [affectedCount, updatedAlerts] = await Alert_1.default.update({ type, title, description, color, icon }, {
                where: { id },
                returning: true
            });
            if (affectedCount === 0) {
                return res.status(404).json({ message: "Alerta não encontrado!" });
            }
            return res.json(updatedAlerts[0]);
        }
        catch (error) {
            const err = error;
            console.error("Erro ao editar o alerta:", err);
            return res.status(500).json({ message: "Erro ao editar o alerta" });
        }
    }
    async deleteAlert(req, res) {
        try {
            const deleted = await Alert_1.default.destroy({
                where: { id: req.params.id }
            });
            if (deleted === 0) {
                return res.status(404).json({ message: "Alerta não encontrado!" });
            }
            return res.json({ message: 'Alerta removido com sucesso!' });
        }
        catch (error) {
            const err = error;
            return res.status(400).json({ message: err.message });
        }
    }
}
exports.default = new AlertController();
//# sourceMappingURL=alertController.js.map