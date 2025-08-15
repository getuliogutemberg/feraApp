"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const EstrategiaParametros_1 = __importDefault(require("../models/EstrategiaParametros"));
const GrupoMaterial_1 = __importDefault(require("../models/GrupoMaterial"));
class ParamsController {
    async getGroupParams(req, res) {
        try {
            const { groupId } = req.params;
            const groupIdNumber = parseInt(groupId);
            if (isNaN(groupIdNumber)) {
                return res.status(400).json({ error: 'ID do grupo deve ser um número' });
            }
            const estrategia = await EstrategiaParametros_1.default.findOne({
                where: {
                    cod_grupo: groupIdNumber,
                    cod_item_material: 0
                }
            });
            if (!estrategia) {
                const estrategiaPadrao = {
                    cod_grupo: groupIdNumber,
                    cod_item_material: 0,
                    client: 'default',
                    cods_parametro: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    cods_opcao: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    data_estrategia: new Date(),
                };
                return res.json(estrategiaPadrao);
            }
            return res.json(estrategia);
        }
        catch (error) {
            const err = error;
            console.error('Erro ao buscar parâmetros do grupo:', err);
            return res.status(500).json({
                error: 'Erro interno ao buscar parâmetros',
                details: err.message
            });
        }
    }
    async getMaterialParams(req, res) {
        try {
            const { materialId } = req.params;
            const materialIdNumber = parseInt(materialId);
            if (isNaN(materialIdNumber)) {
                return res.status(400).json({ error: 'ID do material deve ser um número' });
            }
            const estrategia = await EstrategiaParametros_1.default.findOne({
                where: { cod_item_material: materialIdNumber }
            });
            if (!estrategia) {
                const material = await GrupoMaterial_1.default.findOne({
                    where: { cod_item_material: materialIdNumber }
                });
                if (!material) {
                    return res.status(404).json({
                        message: 'Material não encontrado'
                    });
                }
                const estrategiaPadrao = {
                    cod_grupo: material.cod_grupo,
                    cod_item_material: materialIdNumber,
                    client: 'default',
                    cods_parametro: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    cods_opcao: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    data_estrategia: new Date(),
                };
                return res.json({
                    message: 'Item atualmente sem estratégia, retornando padrão',
                    estrategiaPadrao
                });
            }
            return res.json(estrategia);
        }
        catch (error) {
            const err = error;
            console.error('Erro ao buscar parâmetros do material:', err);
            return res.status(500).json({
                error: 'Erro interno ao buscar parâmetros',
                details: err.message
            });
        }
    }
    async updateGroupParams(req, res) {
        try {
            const { groupId } = req.params;
            const { cods_parametro, cods_opcao, client, data_estrategia, onlyMatchingGroupParams } = req.body;
            const groupIdNumber = parseInt(groupId);
            if (isNaN(groupIdNumber)) {
                return res.status(400).json({ error: 'ID do grupo deve ser um número' });
            }
            if (!cods_parametro || !cods_opcao || !client) {
                return res.status(400).json({
                    error: 'Parâmetros obrigatórios faltando'
                });
            }
            const [updatedCount] = await EstrategiaParametros_1.default.update({ cods_parametro, cods_opcao, client, data_estrategia }, {
                where: {
                    cod_grupo: groupIdNumber,
                    cod_item_material: 0
                }
            });
            if (updatedCount === 0) {
                const materiaisDoGrupo = await GrupoMaterial_1.default.findAll({
                    where: { cod_grupo: groupIdNumber },
                    attributes: ['cod_item_material']
                });
                if (materiaisDoGrupo.length === 0) {
                    return res.status(404).json({
                        message: "Nenhum item encontrado para esse grupo"
                    });
                }
                const novasEstrategias = await EstrategiaParametros_1.default.bulkCreate([
                    {
                        cod_grupo: groupIdNumber,
                        cod_item_material: 0,
                        cods_parametro,
                        cods_opcao,
                        client,
                        data_estrategia: data_estrategia || new Date()
                    },
                    ...materiaisDoGrupo.map(material => ({
                        cod_grupo: groupIdNumber,
                        cod_item_material: material.cod_item_material,
                        cods_parametro,
                        cods_opcao,
                        client,
                        data_estrategia: data_estrategia || new Date()
                    }))
                ]);
                return res.json({
                    message: "Parâmetros criados com sucesso",
                    estrategias: novasEstrategias
                });
            }
            const whereClause = {
                cod_grupo: groupIdNumber,
                cod_item_material: { [sequelize_1.Op.ne]: 0 }
            };
            if (onlyMatchingGroupParams) {
                const grupoParams = await EstrategiaParametros_1.default.findOne({
                    where: {
                        cod_grupo: groupIdNumber,
                        cod_item_material: 0
                    }
                });
                if (grupoParams) {
                    whereClause.cods_parametro = grupoParams.cods_parametro;
                    whereClause.cods_opcao = grupoParams.cods_opcao;
                }
            }
            await EstrategiaParametros_1.default.update({ cods_parametro, cods_opcao, client, data_estrategia }, { where: whereClause });
            return res.json({
                message: "Parâmetros atualizados com sucesso"
            });
        }
        catch (error) {
            const err = error;
            console.error('Erro ao atualizar parâmetros do grupo:', err);
            return res.status(500).json({
                error: 'Erro interno ao atualizar parâmetros',
                details: err.message
            });
        }
    }
    async updateMaterialParams(req, res) {
        try {
            const { materialId } = req.params;
            const { cods_parametro, cods_opcao, client, data_estrategia } = req.body;
            const materialIdNumber = parseInt(materialId);
            if (isNaN(materialIdNumber)) {
                return res.status(400).json({ error: 'ID do material deve ser um número' });
            }
            if (!cods_parametro || !cods_opcao || !client) {
                return res.status(400).json({
                    error: 'Parâmetros obrigatórios faltando'
                });
            }
            const [updatedCount] = await EstrategiaParametros_1.default.update({ cods_parametro, cods_opcao, client, data_estrategia }, {
                where: { cod_item_material: materialIdNumber },
                returning: true
            });
            if (updatedCount === 0) {
                const material = await GrupoMaterial_1.default.findOne({
                    where: { cod_item_material: materialIdNumber }
                });
                if (!material) {
                    return res.status(404).json({
                        message: "Item não encontrado"
                    });
                }
                const grupoParams = await EstrategiaParametros_1.default.findOne({
                    where: {
                        cod_grupo: material.cod_grupo,
                        cod_item_material: 0
                    }
                });
                if (!grupoParams) {
                    return res.status(404).json({
                        message: "Estratégia base do grupo não configurada",
                        details: "Não existe uma estratégia padrão para o grupo desse item",
                        solution: "Defina primeiro os parâmetros do grupo antes de atualizar itens individuais"
                    });
                }
                const newStrategy = await EstrategiaParametros_1.default.create({
                    cod_grupo: material.cod_grupo,
                    cod_item_material: materialIdNumber,
                    cods_parametro,
                    cods_opcao,
                    client,
                    data_estrategia: data_estrategia || new Date()
                });
                return res.json({
                    message: "Parâmetros criados com sucesso",
                    estrategia: newStrategy
                });
            }
            const updatedStrategy = await EstrategiaParametros_1.default.findOne({
                where: { cod_item_material: materialIdNumber }
            });
            return res.json({
                message: "Parâmetros atualizados com sucesso",
                estrategia: updatedStrategy
            });
        }
        catch (error) {
            const err = error;
            console.error('Erro ao atualizar parâmetros do material:', err);
            return res.status(500).json({
                error: 'Erro interno ao atualizar parâmetros',
                details: err.message
            });
        }
    }
    async resetGroupItems(req, res) {
        try {
            const { groupId } = req.params;
            const groupIdNumber = parseInt(groupId);
            if (isNaN(groupIdNumber)) {
                return res.status(400).json({ error: 'ID do grupo deve ser um número' });
            }
            const grupoParams = await EstrategiaParametros_1.default.findOne({
                where: {
                    cod_grupo: groupIdNumber,
                    cod_item_material: 0
                }
            });
            if (!grupoParams) {
                return res.status(404).json({
                    message: "Parâmetros base do grupo não encontrados"
                });
            }
            const [updatedCount] = await EstrategiaParametros_1.default.update({
                cods_parametro: grupoParams.cods_parametro,
                cods_opcao: grupoParams.cods_opcao,
                client: grupoParams.client,
                data_estrategia: new Date()
            }, {
                where: {
                    cod_grupo: groupIdNumber,
                    cod_item_material: { [sequelize_1.Op.ne]: 0 }
                }
            });
            return res.json({
                message: `${updatedCount} itens atualizados com os parâmetros do grupo`,
                updatedCount
            });
        }
        catch (error) {
            const err = error;
            console.error('Erro ao resetar itens do grupo:', err);
            return res.status(500).json({
                error: 'Erro interno ao resetar itens',
                details: err.message
            });
        }
    }
    async resetItem(req, res) {
        try {
            const { materialId } = req.params;
            const materialIdNumber = parseInt(materialId);
            if (isNaN(materialIdNumber)) {
                return res.status(400).json({ error: 'ID do material deve ser um número' });
            }
            const material = await GrupoMaterial_1.default.findOne({
                where: { cod_item_material: materialIdNumber }
            });
            if (!material) {
                return res.status(404).json({
                    message: "Item não encontrado"
                });
            }
            const grupoParams = await EstrategiaParametros_1.default.findOne({
                where: {
                    cod_grupo: material.cod_grupo,
                    cod_item_material: 0
                }
            });
            if (!grupoParams) {
                return res.status(404).json({
                    message: "Parâmetros base do grupo não encontrados"
                });
            }
            const [updatedCount] = await EstrategiaParametros_1.default.update({
                cods_parametro: grupoParams.cods_parametro,
                cods_opcao: grupoParams.cods_opcao,
                client: grupoParams.client,
                data_estrategia: new Date()
            }, { where: { cod_item_material: materialIdNumber } });
            if (updatedCount === 0) {
                const newStrategy = await EstrategiaParametros_1.default.create({
                    cod_grupo: material.cod_grupo,
                    cod_item_material: materialIdNumber,
                    cods_parametro: grupoParams.cods_parametro,
                    cods_opcao: grupoParams.cods_opcao,
                    client: grupoParams.client,
                    data_estrategia: new Date()
                });
                return res.json({
                    message: "Item criado com os parâmetros do grupo",
                    estrategia: newStrategy
                });
            }
            const estrategia = await EstrategiaParametros_1.default.findOne({
                where: { cod_item_material: materialIdNumber }
            });
            return res.json({
                message: "Item atualizado com os parâmetros do grupo",
                estrategia
            });
        }
        catch (error) {
            const err = error;
            console.error('Erro ao resetar item:', err);
            return res.status(500).json({
                error: 'Erro interno ao resetar item',
                details: err.message
            });
        }
    }
}
exports.default = new ParamsController();
//# sourceMappingURL=paramsController.js.map