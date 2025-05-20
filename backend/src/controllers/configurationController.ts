import { Request, Response } from 'express';
import Configuration, { ConfigurationAttributes } from '../models/Configuration';

class ConfigurationController {
  async getConfiguration(_req: Request, res: Response<ConfigurationAttributes | { message: string }>) {
    try {
      const config = await Configuration.findOne();
      
      if (config) {
        const filteredConfig = config.get({ plain: true }) as ConfigurationAttributes;
        return res.json(filteredConfig);
      } else {
        // Se não houver configuração, cria uma nova com os valores padrão
        const newConfig = await Configuration.create({
          notifications: true,
          allowRegister: true,
          allowRequireRegister: true,
          allowNewCategory: true,
          allowNewClassName: true,
          addSecretKey: false,
          addCategory: true,
          fontFamily: 'Arial',
          pageTitle: 'Configurações',
          themeMode: 'light',
          primaryColor: 56,
          secondaryColor: 0,
          backgroundColor: 0,
          textColor: 0,
          pbiKeys: {
            clientId: '',
            clientSecret: '',
            authority: ''
          }
        });
        const filteredNewConfig = newConfig.get({ plain: true }) as ConfigurationAttributes;
        return res.json(filteredNewConfig);
      }
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao buscar configurações:", err);
      return res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  }
  
  async updateConfiguration(req: Request<{}, {}, ConfigurationAttributes>, res: Response<ConfigurationAttributes | { message: string }>) {
    try {
      // Encontra e atualiza a primeira configuração encontrada
      const [affectedCount, updatedConfigs] = await Configuration.update(req.body, {
        where: {},
        returning: true
      });

      if (affectedCount === 0) {
        // Se não existir configuração, cria uma nova
        const newConfig = await Configuration.create(req.body);
        const filteredNewConfig = newConfig.get({ plain: true }) as ConfigurationAttributes;
        return res.json(filteredNewConfig);
      }

      const filteredConfig = updatedConfigs[0].get({ plain: true }) as ConfigurationAttributes;
      return res.json(filteredConfig);
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao atualizar configurações:", err);
      return res.status(500).json({ 
        message: `Erro ao atualizar configurações: ${err.message}`
      });
    }
  }
}

export default new ConfigurationController();