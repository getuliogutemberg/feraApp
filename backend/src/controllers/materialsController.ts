import { Request, Response } from 'express';
import CadastroMaterial from '../models/CadastroMaterial';
import GrupoMaterial from '../models/GrupoMaterial';

class MaterialController {
    async getMaterialByGroup(req: Request<{ cod_grupo: string }>, res: Response) {
        try {
            const { cod_grupo } = req.params;

            // Validação do parâmetro
            if (!cod_grupo || isNaN(Number(cod_grupo))) {
                return res.status(400).json({ 
                    message: "O código do grupo é obrigatório e deve ser um número válido." 
                });
            }

            const grupoId = Number(cod_grupo);

            // Busca os materiais associados ao grupo
            const materiaisDoGrupo = await GrupoMaterial.findAll({ 
                where: { cod_grupo: grupoId } 
            });

            if (materiaisDoGrupo.length === 0) {
                return res.status(404).json({ 
                    message: "Nenhum material encontrado para este grupo.",
                    suggestion: "Verifique se o código do grupo está correto ou associe materiais a este grupo"
                });
            }

            // Extrai os códigos dos materiais
            const codigosMateriais = materiaisDoGrupo.map(m => m.cod_item_material);

            // Busca os detalhes dos materiais
            const materiais = await CadastroMaterial.findAll({ 
                where: { 
                    cod_item_material: codigosMateriais 
                } 
            });

            return res.status(200).json(materiais);
        } catch (error) {
            const err = error as Error;
            console.error(`Erro ao buscar materiais do grupo ${req.params.cod_grupo}:`, err);
            return res.status(500).json({ 
                message: "Erro interno ao buscar materiais do grupo",
                error: err.message 
            });
        }
    }
}

export default new MaterialController();