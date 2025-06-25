import { Sequelize } from 'sequelize';
import mongoose, { Connection } from 'mongoose';

export type DBType = 'sequelize' | 'mongoose';

export interface SequelizeParams {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

export interface MongooseParams {
  uri: string;
}

export type DBParams = SequelizeParams | MongooseParams;

class DatabaseFactory {
  static async testConnection(type: DBType, params: DBParams): Promise<{ success: boolean; error?: string }> {
    try {
      if (type === 'sequelize') {
        const { host, port, database, username, password } = params as SequelizeParams;
        const sequelize = new Sequelize(database, username, password, {
          host,
          port: Number(port),
          dialect: 'postgres', // ou 'mysql', pode ser parametrizado
          logging: false,
        });
        await sequelize.authenticate();
        await sequelize.close();
        return { success: true };
      } else if (type === 'mongoose') {
        const { uri } = params as MongooseParams;
        const conn: Connection = await mongoose.createConnection(uri).asPromise();
        await conn.close();
        return { success: true };
      }
      return { success: false, error: 'Tipo de banco não suportado.' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async listTables(type: DBType, params: DBParams): Promise<{ success: boolean; tables?: string[]; error?: string }> {
    console.log(type,params)
    try {
      if (type === 'sequelize') {
        const { host, port, database, username, password } = params as SequelizeParams;
        const sequelize = new Sequelize(database, username, password, {
          host,
          port: Number(port),
          dialect: 'postgres', // ou 'mysql', pode ser parametrizado
          logging: false,
        });
        const [results] = await sequelize.query(`SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
  AND table_schema NOT IN ('pg_catalog', 'information_schema')`);
        console.log(results)
        const tables = (results as any[]).map(row => row.table_name);
        await sequelize.close();
        return { success: true, tables };
      } else if (type === 'mongoose') {
        const { uri } = params as MongooseParams;
        const conn: Connection = await mongoose.createConnection(uri).asPromise();
        if (!conn.db) {
          await conn.close();
          return { success: false, error: 'Não foi possível acessar o banco de dados MongoDB.'};
        }
        const collections = await conn.db.listCollections().toArray();
        const tables = collections.map(col => col.name);
        await conn.close();
        return { success: true, tables };
      }
      return { success: false, error: 'Tipo de banco não suportado.' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default DatabaseFactory; 