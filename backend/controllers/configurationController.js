const Configuration = require("../models/Configuration");

const getConfiguration = async (req, res) => {
  try {
    const configs = await Configuration.findAll();
    const config = configs[0];
    if (config) {
      const filteredConfig = config.get({ plain: true });
      return res.json(filteredConfig);
    } else {
      // Se não houver configuração, cria uma nova com os valores padrão
      const newConfig = await Configuration.create({});
      const filteredNewConfig = newConfig.get({ plain: true });
      return res.json(filteredNewConfig);
    }
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    res.status(500).json({ message: "Erro ao buscar configurações" });
  }
};

const updateConfiguration = async (req, res) => {
  try {
    const config = await Configuration.findOne();
    if (!config) {
      return res.status(404).json({ message: "Configuração não encontrada" });
    }
    await config.update(req.body);
    const filteredConfig = config.get({ plain: true });
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