"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const PesosAHP = database_1.default.define('pesos_ahp', {
    parametro_1: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
    },
    parametro_2: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
    },
    nivel: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
    },
    peso_default: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    peso_usuario: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    schema: 'internal',
    tableName: 'pesos_ahp',
    timestamps: false,
});
exports.default = PesosAHP;
//# sourceMappingURL=PesosAHP.js.map