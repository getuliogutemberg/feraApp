import { Request, Response } from 'express';
import Alert, { AlertAttributes } from '../models/Alert';

class AlertController {
  async getAllAlerts(_req: Request, res: Response) {
    try {
      // Usando o paranoid do Sequelize para filtrar automaticamente os deletados
      const alerts = await Alert.findAll({
        where: { deletedAt: null }
      });
      return res.json(alerts);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ message: err.message });
    }
  }
  
  async createAlert(req: Request<{}, {}, AlertAttributes>, res: Response) {
    const { type, title, description, color, icon } = req.body;
    
    try {
      const newAlert = await Alert.create({ 
        type, 
        title, 
        description, 
        color, 
        icon 
      });
      return res.status(201).json(newAlert);
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({ message: err.message });
    }
  }
  
  async updateAlert(req: Request<{ id: string }, {}, AlertAttributes>, res: Response) {
    try {
      const { id } = req.params;
      const { type, title, description, color, icon } = req.body;
  
      const [affectedCount, updatedAlerts] = await Alert.update(
        { type, title, description, color, icon },
        { 
          where: { id },
          returning: true 
        }
      );
  
      if (affectedCount === 0) {
        return res.status(404).json({ message: "Alerta não encontrado!" });
      }
  
      return res.json(updatedAlerts[0]);
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao editar o alerta:", err);
      return res.status(500).json({ message: "Erro ao editar o alerta" });
    }
  }
  
  async deleteAlert(req: Request<{ id: string }>, res: Response) {
    try {
      // Soft delete usando o paranoid do Sequelize
      const deleted = await Alert.destroy({
        where: { id: req.params.id }
      });
      
      if (deleted === 0) {
        return res.status(404).json({ message: "Alerta não encontrado!" });
      }
      
      return res.json({ message: 'Alerta removido com sucesso!' });
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({ message: err.message });
    }
  }
}

export default new AlertController();