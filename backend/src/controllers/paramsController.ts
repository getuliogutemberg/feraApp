import { Request, Response } from 'express';
import { Op } from 'sequelize';
import EstrategiaParametros from '../models/EstrategiaParametros';
import GrupoMaterial from '../models/GrupoMaterial';

// Interfaces para tipagem
interface EstrategiaParams {
  cod_grupo: number;
  cod_item_material: number;
  client: string;
  cods_parametro: number[];
  cods_opcao: number[];
  data_estrategia?: Date;
}

interface UpdateParams {
  cods_parametro: number[];
  cods_opcao: number[];
  client: string;
  data_estrategia?: Date;
  onlyMatchingGroupParams?: boolean;
}

class ParamsController {
  async getGroupParams(req: Request<{ groupId: string }>, res: Response) {
    try {
      const { groupId } = req.params;
      const groupIdNumber = parseInt(groupId);

      if (isNaN(groupIdNumber)) {
        return res.status(400).json({ error: 'ID do grupo deve ser um número' });
      }

      const estrategia = await EstrategiaParametros.findOne({ 
        where: { 
          cod_grupo: groupIdNumber, 
          cod_item_material: 0 
        } 
      });

      if (!estrategia) {
        const estrategiaPadrao: EstrategiaParams = {
          cod_grupo: groupIdNumber,
          cod_item_material: 0,
          client: 'default',
          cods_parametro: [0,1,2,3,4,5,6,7,8],
          cods_opcao: [0,0,0,0,0,0,0,0,0],
          data_estrategia: new Date(),
        };
        return res.json(estrategiaPadrao); 
      }

      return res.json(estrategia); 
    } catch (error) {
      const err = error as Error;
      console.error('Erro ao buscar parâmetros do grupo:', err);
      return res.status(500).json({ 
        error: 'Erro interno ao buscar parâmetros',
        details: err.message 
      });
    }
  }

  async getMaterialParams(req: Request<{ materialId: string }>, res: Response) {
    try {
      const { materialId } = req.params;
      const materialIdNumber = parseInt(materialId);

      if (isNaN(materialIdNumber)) {
        return res.status(400).json({ error: 'ID do material deve ser um número' });
      }

      const estrategia = await EstrategiaParametros.findOne({ 
        where: { cod_item_material: materialIdNumber } 
      });

      if (!estrategia) {
        const material = await GrupoMaterial.findOne({ 
          where: { cod_item_material: materialIdNumber } 
        });

        if (!material) {
          return res.status(404).json({ 
            message: 'Material não encontrado' 
          });
        }

        const estrategiaPadrao: EstrategiaParams = {
          cod_grupo: material.cod_grupo,
          cod_item_material: materialIdNumber,
          client: 'default',
          cods_parametro: [0,1,2,3,4,5,6,7,8],
          cods_opcao: [0,0,0,0,0,0,0,0,0],
          data_estrategia: new Date(),
        };
        
        return res.json({ 
          message: 'Item atualmente sem estratégia, retornando padrão', 
          estrategiaPadrao 
        });
      }

      return res.json(estrategia);
    } catch (error) {
      const err = error as Error;
      console.error('Erro ao buscar parâmetros do material:', err);
      return res.status(500).json({ 
        error: 'Erro interno ao buscar parâmetros',
        details: err.message 
      });
    }
  }

  async updateGroupParams(req: Request<{ groupId: string }, {}, UpdateParams>, res: Response) {
    try {
      const { groupId } = req.params;
      const { cods_parametro, cods_opcao, client, data_estrategia, onlyMatchingGroupParams } = req.body;
      const groupIdNumber = parseInt(groupId);

      if (isNaN(groupIdNumber)) {
        return res.status(400).json({ error: 'ID do grupo deve ser um número' });
      }

      // Validação dos parâmetros
      if (!cods_parametro || !cods_opcao || !client) {
        return res.status(400).json({ 
          error: 'Parâmetros obrigatórios faltando' 
        });
      }

      const [updatedCount] = await EstrategiaParametros.update(
        { cods_parametro, cods_opcao, client, data_estrategia },
        { 
          where: { 
            cod_grupo: groupIdNumber, 
            cod_item_material: 0 
          } 
        }
      );

      if (updatedCount === 0) {
        // Cria nova estratégia para o grupo e seus materiais
        const materiaisDoGrupo = await GrupoMaterial.findAll({ 
          where: { cod_grupo: groupIdNumber },
          attributes: ['cod_item_material']
        });

        if (materiaisDoGrupo.length === 0) {
          return res.status(404).json({ 
            message: "Nenhum item encontrado para esse grupo" 
          });
        }

        const novasEstrategias = await EstrategiaParametros.bulkCreate([
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

      // Atualiza materiais conforme filtro
      const whereClause: any = { 
        cod_grupo: groupIdNumber, 
        cod_item_material: { [Op.ne]: 0 } 
      };

      if (onlyMatchingGroupParams) {
        const grupoParams = await EstrategiaParametros.findOne({ 
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

      await EstrategiaParametros.update(
        { cods_parametro, cods_opcao, client, data_estrategia },
        { where: whereClause }
      );

      return res.json({ 
        message: "Parâmetros atualizados com sucesso" 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Erro ao atualizar parâmetros do grupo:', err);
      return res.status(500).json({ 
        error: 'Erro interno ao atualizar parâmetros',
        details: err.message 
      });
    }
  }

  async updateMaterialParams(req: Request<{ materialId: string }, {}, UpdateParams>, res: Response) {
    try {
      const { materialId } = req.params;
      const { cods_parametro, cods_opcao, client, data_estrategia } = req.body;
      const materialIdNumber = parseInt(materialId);

      if (isNaN(materialIdNumber)) {
        return res.status(400).json({ error: 'ID do material deve ser um número' });
      }

      // Validação dos parâmetros
      if (!cods_parametro || !cods_opcao || !client) {
        return res.status(400).json({ 
          error: 'Parâmetros obrigatórios faltando' 
        });
      }

      const [updatedCount] = await EstrategiaParametros.update(
        { cods_parametro, cods_opcao, client, data_estrategia },
        { 
          where: { cod_item_material: materialIdNumber },
          returning: true
        }
      );

      if (updatedCount === 0) {
        const material = await GrupoMaterial.findOne({ 
          where: { cod_item_material: materialIdNumber } 
        });

        if (!material) {
          return res.status(404).json({ 
            message: "Item não encontrado" 
          });
        }

        const grupoParams = await EstrategiaParametros.findOne({ 
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

        const newStrategy = await EstrategiaParametros.create({
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

      const updatedStrategy = await EstrategiaParametros.findOne({ 
        where: { cod_item_material: materialIdNumber } 
      });

      return res.json({ 
        message: "Parâmetros atualizados com sucesso", 
        estrategia: updatedStrategy 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Erro ao atualizar parâmetros do material:', err);
      return res.status(500).json({ 
        error: 'Erro interno ao atualizar parâmetros',
        details: err.message 
      });
    }
  }

  async resetGroupItems(req: Request<{ groupId: string }>, res: Response) {
    try {
      const { groupId } = req.params;
      const groupIdNumber = parseInt(groupId);

      if (isNaN(groupIdNumber)) {
        return res.status(400).json({ error: 'ID do grupo deve ser um número' });
      }

      const grupoParams = await EstrategiaParametros.findOne({ 
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

      const [updatedCount] = await EstrategiaParametros.update(
        { 
          cods_parametro: grupoParams.cods_parametro, 
          cods_opcao: grupoParams.cods_opcao, 
          client: grupoParams.client, 
          data_estrategia: new Date()
        },
        { 
          where: { 
            cod_grupo: groupIdNumber, 
            cod_item_material: { [Op.ne]: 0 } 
          } 
        }
      );

      return res.json({ 
        message: `${updatedCount} itens atualizados com os parâmetros do grupo`,
        updatedCount 
      });
    } catch (error) { 
      const err = error as Error;
      console.error('Erro ao resetar itens do grupo:', err);
      return res.status(500).json({ 
        error: 'Erro interno ao resetar itens',
        details: err.message 
      });
    }
  }

  async resetItem(req: Request<{ materialId: string }>, res: Response) {
    try {
      const { materialId } = req.params;
      const materialIdNumber = parseInt(materialId);

      if (isNaN(materialIdNumber)) {
        return res.status(400).json({ error: 'ID do material deve ser um número' });
      }

      const material = await GrupoMaterial.findOne({ 
        where: { cod_item_material: materialIdNumber } 
      });

      if (!material) {
        return res.status(404).json({ 
          message: "Item não encontrado" 
        });
      }

      const grupoParams = await EstrategiaParametros.findOne({ 
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

      const [updatedCount] = await EstrategiaParametros.update(
        {
          cods_parametro: grupoParams.cods_parametro,
          cods_opcao: grupoParams.cods_opcao,
          client: grupoParams.client,
          data_estrategia: new Date()
        },
        { where: { cod_item_material: materialIdNumber } }
      );

      if (updatedCount === 0) {
        // Se não existir, cria uma nova estratégia com os parâmetros do grupo
        const newStrategy = await EstrategiaParametros.create({
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

      const estrategia = await EstrategiaParametros.findOne({ 
        where: { cod_item_material: materialIdNumber } 
      });

      return res.json({ 
        message: "Item atualizado com os parâmetros do grupo", 
        estrategia 
      });
    } catch (error) {
      const err = error as Error;
      console.error('Erro ao resetar item:', err);
      return res.status(500).json({ 
        error: 'Erro interno ao resetar item',
        details: err.message 
      });
    }
  }
}

export default new ParamsController();