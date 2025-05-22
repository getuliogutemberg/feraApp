import { Request, Response } from 'express';
import DicionarioGrupo from '../models/DicionarioGrupo';

class GroupDictionaryController {
    async getGroupDictionaries(_req: Request, res: Response) {
        try {
            const groupDictionaries = await DicionarioGrupo.findAll();
            
            if (groupDictionaries && groupDictionaries.length > 0) {
                res.status(200).json(groupDictionaries);
            } else {
                res.status(404).json({ 
                    message: "Nenhum grupo encontrado",
                    suggestion: "Cadastre novos grupos para visualizá-los aqui"
                });
            }
        } catch (error) {
            const err = error as Error;
            console.error('Erro ao buscar grupos:', err.message);
            res.status(500).json({ 
                message: "Erro interno ao buscar grupos",
                error: err.message 
            });
        }
    }
}

export default new GroupDictionaryController();