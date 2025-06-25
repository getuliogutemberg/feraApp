import { Request, Response } from 'express';
import DatabaseFactory, { DBType, DBParams } from '../services/DatabaseFactory';

const adminDatabaseController = {
  async testConnection(req: Request, res: Response) {
    const { type, params } = req.body as { type: DBType; params: DBParams };
    if (!type || !params) {
      return res.status(400).json({ success: false, error: 'Parâmetros ausentes.' });
    }
    const result = await DatabaseFactory.testConnection(type, params);
    if (result.success) {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: result.error });
    }
  },

  async listTables(req: Request, res: Response) {
    const { type, params } = req.body as { type: DBType; params: DBParams };
    if (!type || !params) {
      return res.status(400).json({ success: false, error: 'Parâmetros ausentes.' });
    }
    const result = await DatabaseFactory.listTables(type, params);
    if (result.success) {
      return res.json({ success: true, tables: result.tables });
    } else {
      return res.status(400).json({ success: false, error: result.error });
    }
  },
};

export default adminDatabaseController; 