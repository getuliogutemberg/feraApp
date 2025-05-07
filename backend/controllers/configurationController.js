
const Configuration = require("../models/Configuration");


 const getConfiguration = async (req, res) => {
    try {
      const config = (await Configuration.find())[0];
      if (config) {
        const { _id, createdAt, updatedAt, __v, ...filteredConfig } = config.toObject();
        return res.json(filteredConfig);
      } else {
        // Se não houver configuração, cria uma nova com os valores padrão
        const newConfig = new Configuration();
        await newConfig.save();
        const { _id, createdAt, updatedAt, __v, ...filteredNewConfig } = newConfig.toObject();
        return res.json(filteredNewConfig);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  };
  
  const updateConfiguration = async (req, res) => {
    try {
      const updatedConfig = await Configuration.findOneAndUpdate({}, req.body, { new: true });
  
      if (!updatedConfig) {
        return res.status(404).json({ message: "Configuração não encontrada" });
      }
  
      const { _id, createdAt, updatedAt, __v, ...filteredConfig } = updatedConfig.toObject();
      res.json(filteredConfig);
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      res.status(500).json({ message: "Erro ao atualizar configurações" });
    }
  };

  module.exports = {
    getConfiguration,
    updateConfiguration,
  }