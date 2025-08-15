"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Configuration_1 = __importDefault(require("../models/Configuration"));
class ConfigurationController {
    async getConfiguration(_req, res) {
        try {
            const config = await Configuration_1.default.findOne();
            if (config) {
                const filteredConfig = config.get({ plain: true });
                return res.json(filteredConfig);
            }
            else {
                const newConfig = await Configuration_1.default.create({
                    notifications: true,
                    allowRegister: true,
                    allowRequireRegister: true,
                    allowNewCategory: true,
                    allowNewClassName: true,
                    addSecretKey: false,
                    addCategory: true,
                    fontFamily: 'Arial',
                    pageTitle: 'Configurações',
                    themeMode: 'light',
                    primaryColor: 56,
                    secondaryColor: 0,
                    backgroundColor: 0,
                    textColor: 0,
                    pbiKeys: {
                        clientId: '',
                        clientSecret: '',
                        authority: ''
                    }
                });
                const filteredNewConfig = newConfig.get({ plain: true });
                return res.json(filteredNewConfig);
            }
        }
        catch (error) {
            const err = error;
            console.error("Erro ao buscar configurações:", err);
            return res.status(500).json({ message: "Erro ao buscar configurações" });
        }
    }
    async updateConfiguration(req, res) {
        try {
            const [affectedCount, updatedConfigs] = await Configuration_1.default.update(req.body, {
                where: {},
                returning: true
            });
            if (affectedCount === 0) {
                const newConfig = await Configuration_1.default.create(req.body);
                const filteredNewConfig = newConfig.get({ plain: true });
                return res.json(filteredNewConfig);
            }
            const filteredConfig = updatedConfigs[0].get({ plain: true });
            return res.json(filteredConfig);
        }
        catch (error) {
            const err = error;
            console.error("Erro ao atualizar configurações:", err);
            return res.status(500).json({
                message: `Erro ao atualizar configurações: ${err.message}`
            });
        }
    }
}
exports.default = new ConfigurationController();
//# sourceMappingURL=configurationController.js.map