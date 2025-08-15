"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CadastroMaterial_1 = __importDefault(require("../models/CadastroMaterial"));
const GrupoMaterial_1 = __importDefault(require("../models/GrupoMaterial"));
class MaterialController {
    async getMaterialByGroup(req, res) {
        try {
            const { cod_grupo } = req.params;
            if (!cod_grupo || isNaN(Number(cod_grupo))) {
                return res.status(400).json({
                    message: "O código do grupo é obrigatório e deve ser um número válido."
                });
            }
            const grupoId = Number(cod_grupo);
            const materiaisDoGrupo = await GrupoMaterial_1.default.findAll({
                where: { cod_grupo: grupoId }
            });
            if (materiaisDoGrupo.length === 0) {
                return res.status(404).json({
                    message: "Nenhum material encontrado para este grupo.",
                    suggestion: "Verifique se o código do grupo está correto ou associe materiais a este grupo"
                });
            }
            const codigosMateriais = materiaisDoGrupo.map(m => m.cod_item_material);
            const materiais = await CadastroMaterial_1.default.findAll({
                where: {
                    cod_item_material: codigosMateriais
                }
            });
            return res.status(200).json(materiais);
        }
        catch (error) {
            const err = error;
            console.error(`Erro ao buscar materiais do grupo ${req.params.cod_grupo}:`, err);
            return res.status(500).json({
                message: "Erro interno ao buscar materiais do grupo",
                error: err.message
            });
        }
    }
}
exports.default = new MaterialController();
//# sourceMappingURL=materialsController.js.map