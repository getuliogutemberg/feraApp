"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DicionarioGrupo_1 = __importDefault(require("../models/DicionarioGrupo"));
class GroupDictionaryController {
    async getGroupDictionaries(_req, res) {
        try {
            const groupDictionaries = await DicionarioGrupo_1.default.findAll();
            if (groupDictionaries && groupDictionaries.length > 0) {
                res.status(200).json(groupDictionaries);
            }
            else {
                res.status(404).json({
                    message: "Nenhum grupo encontrado",
                    suggestion: "Cadastre novos grupos para visualizá-los aqui"
                });
            }
        }
        catch (error) {
            const err = error;
            console.error('Erro ao buscar grupos:', err.message);
            res.status(500).json({
                message: "Erro interno ao buscar grupos",
                error: err.message
            });
        }
    }
}
exports.default = new GroupDictionaryController();
//# sourceMappingURL=groupDictionaryController.js.map