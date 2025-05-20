const Configuration = require("../models/Configuration");

class ConfigurationController {
  getConfiguration = async (req, res) => {
    try {
      const config = await Configuration.findOne();
      if (config) {
        const filteredConfig = config.get({ plain: true });
        return res.json(filteredConfig);
      } else {
        // Se não houver configuração, cria uma nova com os valores padrão
        const newConfig = new Configuration();
        await newConfig.save();
        const filteredNewConfig = newConfig.get({ plain: true });
        return res.json(filteredNewConfig);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  };
  
  updateConfiguration = async (req, res) => {
    try {
      const updatedConfig = await Configuration.findOneAndUpdate({}, req.body, { new: true });
  
      if (!updatedConfig) {
        return res.status(404).json({ message: "Configuração não encontrada" });
      }
  
      const filteredConfig = updatedConfig.get({ plain: true });
      res.json(filteredConfig);
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      res.status(500).json({ message: "Erro ao atualizar configurações" });
    }
  };
}

module.exports = new ConfigurationController();