const cadastro_material = require("../models/CadastroMaterial");
const grupo_material = require("../models/GrupoMaterial")

class MaterialController {
    async getMaterialByGroup(req, res) {
        try {
            const { cod_grupo } = req.params;

            if (!cod_grupo) {
                return res.status(400).json({ message: "O código do grupo é obrigatório." });
            }

            const materiaisDoGrupo = await grupo_material.find({ cod_grupo: cod_grupo });

            if (materiaisDoGrupo.length === 0) {
                return res.status(404).json({ message: "Nenhum material encontrado para este grupo." });
            }

            const codigosMateriais = materiaisDoGrupo.map(m => m.cod_item_material);

            const materiais = await cadastro_material.find({ cod_item_material: { $in: codigosMateriais } });

            res.status(200).json(materiais);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new MaterialController();