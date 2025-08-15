"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateObsolescencia = exports.updatePesosAHP = exports.deleteCustoHxH = exports.updateCustoHxH = exports.createCustoHxH = exports.getPesosAHP = exports.getCustoHxH = exports.getObsolescencia = void 0;
const NivelObsolescencia_1 = __importDefault(require("../models/NivelObsolescencia"));
const CustoHxH_1 = __importDefault(require("../models/CustoHxH"));
const PesosAHP_1 = __importDefault(require("../models/PesosAHP"));
const getObsolescencia = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const { count, rows } = await NivelObsolescencia_1.default.findAndCountAll({
            attributes: ['cod_equipamento', 'peso_parametro'],
            limit: limit,
            offset: offset,
            order: [['cod_equipamento', 'DESC']],
        });
        const data = rows.map((e) => ({
            codigo: e.cod_equipamento,
            peso: e.peso_parametro,
        }));
        return res.json({
            totalItems: count,
            items: data,
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Erro ao buscar obsolescência' });
    }
};
exports.getObsolescencia = getObsolescencia;
const getCustoHxH = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const { count, rows } = await CustoHxH_1.default.findAndCountAll({
            attributes: ['tuc', 'ano_inicio_validade', 'custo_hxh'],
            limit: limit,
            offset: offset,
            order: [['ano_inicio_validade', 'DESC']],
        });
        const data = rows.map((e) => ({
            ano: e.ano_inicio_validade,
            tuc: e.tuc,
            custo: e.custo_hxh,
        }));
        return res.json({
            totalItems: count,
            items: data,
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Erro ao buscar custo HxH' });
    }
};
exports.getCustoHxH = getCustoHxH;
const getPesosAHP = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const { count, rows } = await PesosAHP_1.default.findAndCountAll({
            attributes: ['parametro_1', 'parametro_2', 'nivel', 'peso_default', 'peso_usuario'],
            limit: limit,
            offset: offset,
            order: [['parametro_1', 'DESC']],
        });
        const data = rows.map((e) => ({
            parametro1: e.parametro_1,
            parametro2: e.parametro_2,
            nivel: e.nivel,
            pesoDefault: e.peso_default,
            pesoUsuario: e.peso_usuario,
        }));
        return res.json({
            totalItems: count,
            items: data,
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Erro ao buscar pesos AHP' });
    }
};
exports.getPesosAHP = getPesosAHP;
const createCustoHxH = async (req, res) => {
    try {
        const { ano, tuc, custo } = req.body;
        const newCusto = await CustoHxH_1.default.create({ ano_inicio_validade: ano, tuc, custo_hxh: custo });
        return res.status(201).json(newCusto);
    }
    catch (err) {
        return res.status(500).json({ error: 'Erro ao criar custo HxH' });
    }
};
exports.createCustoHxH = createCustoHxH;
const updateCustoHxH = async (req, res) => {
    try {
        const { ano, tuc, custo } = req.body;
        const custoItem = await CustoHxH_1.default.findOne({ where: { tuc: tuc, ano_inicio_validade: ano } });
        if (!custoItem) {
            return res.status(404).json({ error: 'Custo HxH não encontrado' });
        }
        await custoItem.update({ custo_hxh: custo });
        return res.json(custoItem);
    }
    catch (err) {
        return res.status(500).json({ error: 'Erro ao atualizar custo HxH' });
    }
};
exports.updateCustoHxH = updateCustoHxH;
const deleteCustoHxH = async (req, res) => {
    try {
        const { ano, tuc } = req.body;
        const deletedCount = await CustoHxH_1.default.destroy({ where: { tuc: tuc, ano_inicio_validade: ano } });
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Custo HxH não encontrado' });
        }
        return res.status(204).send();
    }
    catch (err) {
        return res.status(500).json({ error: 'Erro ao deletar custo HxH' });
    }
};
exports.deleteCustoHxH = deleteCustoHxH;
const updatePesosAHP = async (req, res) => {
    try {
        const { parametro1, parametro2, nivel, pesoDefault, pesoUsuario } = req.body;
        const ahpItem = await PesosAHP_1.default.findOne({
            where: {
                parametro_1: parametro1,
                parametro_2: parametro2,
                nivel: nivel,
            },
        });
        if (!ahpItem) {
            return res.status(404).json({ error: 'Peso AHP não encontrado' });
        }
        await ahpItem.update({
            peso_default: pesoDefault,
            peso_usuario: pesoUsuario,
        });
        return res.json(ahpItem);
    }
    catch (err) {
        return res.status(500).json({ error: 'Erro ao atualizar Peso AHP' });
    }
};
exports.updatePesosAHP = updatePesosAHP;
const updateObsolescencia = async (req, res) => {
    try {
        const { codigo, peso } = req.body;
        const obsItem = await NivelObsolescencia_1.default.findOne({ where: { cod_equipamento: codigo } });
        if (!obsItem) {
            return res.status(404).json({ error: 'Nível de Obsolescencia não encontrado' });
        }
        await obsItem.update({ peso_parametro: peso });
        return res.json(obsItem);
    }
    catch (err) {
        return res.status(500).json({ error: 'Erro ao atualizar Nível de Obsolescencia' });
    }
};
exports.updateObsolescencia = updateObsolescencia;
//# sourceMappingURL=equipamentoManutController.js.map