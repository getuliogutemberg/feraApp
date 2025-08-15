"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseFactory_1 = __importDefault(require("../services/DatabaseFactory"));
const adminDatabaseController = {
    async testConnection(req, res) {
        const { type, params } = req.body;
        if (!type || !params) {
            return res.status(400).json({ success: false, error: 'Parâmetros ausentes.' });
        }
        const result = await DatabaseFactory_1.default.testConnection(type, params);
        if (result.success) {
            return res.json({ success: true });
        }
        else {
            return res.status(400).json({ success: false, error: result.error });
        }
    },
    async listTables(req, res) {
        const { type, params } = req.body;
        if (!type || !params) {
            return res.status(400).json({ success: false, error: 'Parâmetros ausentes.' });
        }
        const result = await DatabaseFactory_1.default.listTables(type, params);
        if (result.success) {
            return res.json({ success: true, tables: result.tables });
        }
        else {
            return res.status(400).json({ success: false, error: result.error });
        }
    },
};
exports.default = adminDatabaseController;
//# sourceMappingURL=adminDatabaseController.js.map