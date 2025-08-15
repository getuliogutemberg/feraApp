"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const mongoose_1 = __importDefault(require("mongoose"));
class DatabaseFactory {
    static async testConnection(type, params) {
        try {
            if (type === 'sequelize') {
                const { host, port, database, username, password } = params;
                const sequelize = new sequelize_1.Sequelize(database, username, password, {
                    host,
                    port: Number(port),
                    dialect: 'postgres',
                    logging: false,
                });
                await sequelize.authenticate();
                await sequelize.close();
                return { success: true };
            }
            else if (type === 'mongoose') {
                const { uri } = params;
                const conn = await mongoose_1.default.createConnection(uri).asPromise();
                await conn.close();
                return { success: true };
            }
            return { success: false, error: 'Tipo de banco não suportado.' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    static async listTables(type, params) {
        console.log(type, params);
        try {
            if (type === 'sequelize') {
                const { host, port, database, username, password } = params;
                const sequelize = new sequelize_1.Sequelize(database, username, password, {
                    host,
                    port: Number(port),
                    dialect: 'postgres',
                    logging: false,
                });
                const [results] = await sequelize.query(`SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
  AND table_schema NOT IN ('pg_catalog', 'information_schema')`);
                console.log(results);
                const tables = results.map(row => row.table_name);
                await sequelize.close();
                return { success: true, tables };
            }
            else if (type === 'mongoose') {
                const { uri } = params;
                const conn = await mongoose_1.default.createConnection(uri).asPromise();
                if (!conn.db) {
                    await conn.close();
                    return { success: false, error: 'Não foi possível acessar o banco de dados MongoDB.' };
                }
                const collections = await conn.db.listCollections().toArray();
                const tables = collections.map(col => col.name);
                await conn.close();
                return { success: true, tables };
            }
            return { success: false, error: 'Tipo de banco não suportado.' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
}
exports.default = DatabaseFactory;
//# sourceMappingURL=DatabaseFactory.js.map