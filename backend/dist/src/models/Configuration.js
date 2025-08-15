"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Configuration extends sequelize_1.Model {
}
Configuration.init({
    notifications: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    allowRegister: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    allowRequireRegister: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    allowNewCategory: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    allowNewClassName: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    addSecretKey: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    addCategory: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    fontFamily: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'Arial'
    },
    pageTitle: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'Configurações'
    },
    themeMode: {
        type: sequelize_1.DataTypes.ENUM('light', 'dark'),
        defaultValue: 'light'
    },
    primaryColor: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 56
    },
    secondaryColor: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 180
    },
    backgroundColor: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    textColor: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    pbiKeys: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: {
            clientId: 'b918d10b-19f4-44c3-a58e-36e311e734ce',
            clientSecret: 'dmZ8Q~Nmgk-9wiaO2Wxe6qRc8TZI.MZ8ob3psaP5',
            authority: 'https://login.microsoftonline.com/80899d73-a5f2-4a53-b252-077af6003b36'
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'Configuration',
    schema: 'internal',
    timestamps: true
});
exports.default = Configuration;
//# sourceMappingURL=Configuration.js.map