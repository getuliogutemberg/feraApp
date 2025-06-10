import { Request, Response } from 'express';
// import EquipamentoManut from '../models/EquipamentoManut';
import NivelObsolescencia from '../models/NivelObsolescencia';
import CustoHxH from '../models/CustoHxH';
import PesosAHP from '../models/PesosAHP';

export const getObsolescencia = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10; // Default 10 itens por página
    const offset = parseInt(req.query.offset as string) || 0; // Default começa no 0

    const { count, rows } = await NivelObsolescencia.findAndCountAll({
      attributes: ['cod_equipamento', 'peso_parametro'],
      limit: limit,
      offset: offset,
      order: [['cod_equipamento', 'DESC']], // Order by cod_equipamento in descending order
    });

    const data = rows.map((e: any) => ({
      codigo: e.cod_equipamento,
      peso: e.peso_parametro,
    }));

    return res.json({
      totalItems: count,
      items: data,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar obsolescência' });
  }
};

export const getCustoHxH = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10; // Default 10 itens por página
    const offset = parseInt(req.query.offset as string) || 0; // Default começa no 0

    const { count, rows } = await CustoHxH.findAndCountAll({
      attributes: ['tuc', 'ano_inicio_validade', 'custo_hxh'],
      limit: limit,
      offset: offset,
      order: [['ano_inicio_validade', 'DESC']], // Order by ano_inicio_validade in descending order
    });

    const data = rows.map((e: any) => ({
      ano: e.ano_inicio_validade,
      tuc: e.tuc,
      custo: e.custo_hxh,
    }));

    return res.json({
      totalItems: count,
      items: data,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar custo HxH' });
  }
};

export const getPesosAHP = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10; // Default 10 itens por página
    const offset = parseInt(req.query.offset as string) || 0; // Default começa no 0

    const { count, rows } = await PesosAHP.findAndCountAll({
      attributes: ['parametro_1', 'parametro_2', 'nivel', 'peso_default', 'peso_usuario'],
      limit: limit,
      offset: offset,
      order: [['parametro_1', 'DESC']], // Order by parametro_1 in descending order
    });

    const data = rows.map((e: any) => ({
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
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar pesos AHP' });
  }
};

export const createCustoHxH = async (req: Request, res: Response) => {
  try {
    const { ano, tuc, custo } = req.body;
    const newCusto = await CustoHxH.create({ ano_inicio_validade: ano, tuc, custo_hxh: custo });
    return res.status(201).json(newCusto);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar custo HxH' });
  }
};

export const updateCustoHxH = async (req: Request, res: Response) => {
  try {
    const { ano, tuc, custo } = req.body;

    const custoItem = await CustoHxH.findOne({ where: { tuc: tuc, ano_inicio_validade: ano } }); // Use composite key for update

    if (!custoItem) {
      return res.status(404).json({ error: 'Custo HxH não encontrado' });
    }

    await custoItem.update({ custo_hxh: custo }); // Only update costo, tuc and ano are part of primary key
    return res.json(custoItem);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar custo HxH' });
  }
};

export const deleteCustoHxH = async (req: Request, res: Response) => {
  try {
    const { ano, tuc } = req.body; // Get composite key from body
    const deletedCount = await CustoHxH.destroy({ where: { tuc: tuc, ano_inicio_validade: ano } }); // Use composite key for delete

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Custo HxH não encontrado' });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar custo HxH' });
  }
};

export const updatePesosAHP = async (req: Request, res: Response) => {
  try {
    const { parametro1, parametro2, nivel, pesoDefault, pesoUsuario } = req.body;

    const ahpItem = await PesosAHP.findOne({
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
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar Peso AHP' });
  }
};

export const updateObsolescencia = async (req: Request, res: Response) => {
  try {
    const { codigo, peso } = req.body;

    const obsItem = await NivelObsolescencia.findOne({ where: { cod_equipamento: codigo } });

    if (!obsItem) {
      return res.status(404).json({ error: 'Nível de Obsolescencia não encontrado' });
    }

    await obsItem.update({ peso_parametro: peso });

    return res.json(obsItem);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar Nível de Obsolescencia' });
  }
}; 