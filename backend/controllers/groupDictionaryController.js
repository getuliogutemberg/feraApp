const dicionario_grupos = require("../models/DicionarioGrupo");

class GroupDictionaryController{
    async getGroupDictionaries(req, res) {
        try {
            const groupDictionary = await dicionario_grupos.findAll();
            if (groupDictionary && groupDictionary.length > 0) {
                res.status(200).json(groupDictionary);
            } else {
                res.status(404).json({ message: "Grupo não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = new GroupDictionaryController();
