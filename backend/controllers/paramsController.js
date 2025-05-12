const estrategia_parametros = require("../models/EstrategiaParametros");
const grupo_material = require("../models/GrupoMaterial");

class ParamsController {
  async getGroupParams(req, res) {
    try {
      const { groupId } = req.params;
      const estrategia = await estrategia_parametros.findOne({ cod_grupo: groupId, cod_item_material: 0 });

      if (!estrategia) {
        const estrategiaPadrao = {
          cod_grupo: groupId,
          cod_item_material: 0,
          client: 'default',
          cods_parametro: [0,1,2,3,4,5,6,7,8],
          cods_opcao: [0,0,0,0,0,0,0,0,0],
          data_estrategia: new Date(),
        }
        return res.json(estrategiaPadrao); 
      }

      return res.json(estrategia); 
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getMaterialParams(req, res) {
    try {
      const { materialId } = req.params;

      const estrategia = await estrategia_parametros.findOne({ cod_item_material: materialId });

      if (!estrategia) {
        const material = await grupo_material.findOne({ cod_item_material: materialId })

        const estrategiaPadrao = {
          cod_grupo: material.cod_grupo,
          cod_item_material: materialId,
          client: 'default',
          cods_parametro: [0,1,2,3,4,5,6,7,8],
          cods_opcao: [0,0,0,0,0,0,0,0,0],
          data_estrategia: new Date(),
        }
        return res.json({ message: 'Item atualmente sem estratégia, retornando padrão', estrategiaPadrao });
      } else {
        return res.json(estrategia);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateGroupParams(req, res) {
    try {
      const { groupId } = req.params;
      const { cods_parametro, cods_opcao, client, data_estrategia, onlyMatchingGroupParams } = req.body;
  
      const existingStrategies = await estrategia_parametros.find({ cod_grupo: groupId, cod_item_material: 0 });
  
      if (existingStrategies.length > 0) {
        await estrategia_parametros.updateMany(
          { cod_grupo: groupId, cod_item_material: 0 },
          { cods_parametro: cods_parametro, cods_opcao: cods_opcao, client: client, data_estrategia: data_estrategia }
        );

        // Filtrando apenas itens com parâmetros iguais ao grupo
        const filter = { cod_grupo: groupId, cod_item_material: { $ne: 0 } };
        
        if (onlyMatchingGroupParams) {
          filter.cods_parametro = existingStrategies[0].cods_parametro;
          filter.cods_opcao = existingStrategies[0].cods_opcao;
        }

        // Atualiza os materiais conforme o filtro
        await estrategia_parametros.updateMany(
          filter,
          { $set: { cods_parametro: cods_parametro, cods_opcao: cods_opcao, client: client, data_estrategia: data_estrategia } }
        );

        return res.json({ message: "Parâmetros atualizados com sucesso" });
      } else {
        const materiaisDoGrupo = await grupo_material.find({ cod_grupo: groupId }).distinct("cod_item_material");
  
        if (materiaisDoGrupo.length === 0) {
          return res.status(404).json({ message: "Nenhum item encontrado para esse grupo" });
        }
  
        const novasEstrategias = [
          // Primeiro adiciona a estratégia do grupo (cod_item_material = 0)
          {
            cod_grupo: groupId,
            cod_item_material: 0,  // Estratégia base do grupo
            cods_parametro: cods_parametro,
            cods_opcao: cods_opcao,
            client: client,
            data_estrategia: data_estrategia
          },
          // Depois adiciona as estratégias para cada material
          ...materiaisDoGrupo.map(cod_item_material => ({
            cod_grupo: groupId,
            cod_item_material: cod_item_material,
            cods_parametro: cods_parametro,
            cods_opcao: cods_opcao,
            client: client,
            data_estrategia: data_estrategia
          }))
        ];
        
        await estrategia_parametros.insertMany(novasEstrategias);
  
        return res.json({ estrategias: novasEstrategias });
      }
  
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  async updateMaterialParams(req, res) {
    try {
      const { materialId } = req.params;
      const { cods_parametro, cods_opcao, client, data_estrategia } = req.body;
      const existingStrategie = await estrategia_parametros.find({ cod_item_material: materialId });

      if (!existingStrategie) {
        return res.status(404).json({ 
          message: "Estratégia base do grupo não configurada",
          details: `Não existe uma estratégia padrão  para o grupo desse item`,
          solution: "Defina primeiro os parâmetros do grupo antes de atualizar itens individuais"
        })
      }

      const estrategia = await estrategia_parametros.findOneAndUpdate(
        { cod_item_material: materialId },
        { cods_parametro: cods_parametro, cods_opcao: cods_opcao, client: client, data_estrategia: data_estrategia },
        { new: true }
      );

      return res.json({ message: "Parâmetros atualizados com sucesso", estrategia });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async resetGroupItems(req, res) {
    try {
      const { groupId } = req.params;

      const grupoParams = await estrategia_parametros.findOne({ cod_grupo: groupId, cod_item_material: 0 });

      if (!grupoParams) {
        return res.status(404).json({ message: "Parâmetros base do grupo não encontrados" });
      }

      const novasEstrategias = await estrategia_parametros.updateMany(
        { cod_grupo: groupId, cod_item_material: { $ne: 0 } },
        { 
          cods_parametro: grupoParams.cods_parametro, 
          cods_opcao: grupoParams.cods_opcao, 
          client: grupoParams.client, 
          data_estrategia: new Date()
        },
        { new: true }
      );

      return res.json({ estrategias: novasEstrategias});
    } catch (error) { 
      return res.status(500).json({ error: error.message });
    }
  }

  async resetItem(req, res) {
    try {
      const { materialId } = req.params;

      const material = await grupo_material.findOne({ where: { cod_item_material: materialId } });

      if (!material) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      const groupId = material.cod_grupo;

      const grupoParams = await estrategia_parametros.findOne({ where: { cod_grupo: groupId, cod_item_material: 0 } });

      if (!grupoParams) {
        return res.status(404).json({ message: "Parâmetros base do grupo não encontrados" });
      }

      await estrategia_parametros.update(
        {
          cods_parametro: grupoParams.cods_parametro,
          cods_opcao: grupoParams.cods_opcao,
          client: grupoParams.client,
          data_estrategia: new Date()
        },
        { where: { cod_item_material: materialId } }
      );

      const estrategia = await estrategia_parametros.findOne({ where: { cod_item_material: materialId } });

      return res.json({ message: "Item atualizado com os parâmetros do grupo", estrategia });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ParamsController();