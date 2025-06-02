import { Request, Response } from 'express';
import EquipamentoManut from '../models/EquipamentoManut';

export const getObsolescencia = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10; // Default 10 itens por página
    const offset = parseInt(req.query.offset as string) || 0; // Default começa no 0

    // Retorna código do equipamento e peso (ajustar coluna de peso se necessário)
    const { count, rows } = await EquipamentoManut.findAndCountAll({
      attributes: ['f_equipamento'],
      limit: limit,
      offset: offset,
    });

    // Simulando peso, pois não foi especificada a coluna
    const data = rows.map((e: any) => ({
      codigo: e.f_equipamento,
      peso: Math.floor(Math.random() * 200) // Troque para a coluna correta se existir
    }));

    res.json({
      totalItems: count,
      items: data,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar obsolescência' });
  }
};

export const getCustoHxH = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10; // Default 10 itens por página
    const offset = parseInt(req.query.offset as string) || 0; // Default começa no 0

    const { count, rows } = await EquipamentoManut.findAndCountAll({
      attributes: ['f_ano', 'f_cod_tuc', 'f_hxh_valor'],
      limit: limit,
      offset: offset,
    });

    const data = rows.map((e: any) => ({
      ano: e.f_ano,
      tuc: e.f_cod_tuc,
      custo: e.f_hxh_valor
    }));

    res.json({
      totalItems: count,
      items: data,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar custo HxH' });
  }
};

export const getPesosAHP = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10; // Default 10 itens por página
    const offset = parseInt(req.query.offset as string) || 0; // Default começa no 0

    const { count, rows } = await EquipamentoManut.findAndCountAll({
      attributes: ['f_desc_familia', 'f_desc_tuc', 'f_tipo_serv_agrupado', 'f_hxh_decimal'],
      limit: limit,
      offset: offset,
    });

    const data = rows.map((e: any) => ({
      parametro1: e.f_desc_familia,
      parametro2: e.f_desc_tuc,
      nivel: e.f_tipo_serv_agrupado,
      pesoDefault: e.f_hxh_decimal,
      pesoUsuario: e.f_hxh_decimal
    }));

    res.json({
      totalItems: count,
      items: data,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pesos AHP' });
  }
}; 