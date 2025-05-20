const { Alert } = require("../models/Alert");

class AlertController {
  getAllAlerts = async (req, res) => {
    try {
      const alerts = (await Alert.find()).filter(alert => !alert.deletedAt);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  createAlert = async (req, res) => {
    const { type, title, description, color, icon } = req.body;
    const alert = new Alert({ type, title, description, color, icon });
  
    try {
      const newAlert = await alert.save();
      res.status(201).json(newAlert);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  
  updateAlert = async (req, res) => {
    try {
      const { id } = req.params;
      const { type, title, description, color, icon, deleteAt } = req.body;
  
      const updatedAlert = await Alert.findByIdAndUpdate(id, {
        type,
        title,
        description,
        color,
        icon,
        deleteAt // se você quiser alterar esse campo também
      }, { new: true });
  
      if (!updatedAlert) {
        return res.status(404).json({ message: "Alerta não encontrado!" });
      }
  
      res.json(updatedAlert);
    } catch (error) {
      console.error("Erro ao editar o alerta:", error);
      res.status(500).json({ message: "Erro ao editar o alerta" });
    }
  }
  
  deleteAlert = async (req, res) => {
    try {
      await Alert.findByIdAndDelete(req.params.id);
      res.json({ message: 'Alerta removido com sucesso!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AlertController();
