"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const CustoHxH = database_1.default.define('custo_hxh', {
    tuc: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    ano_inicio_validade: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    custo_hxh: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    schema: 'internal',
    tableName: 'custo_hxh',
    timestamps: false,
});
exports.default = CustoHxH;
//# sourceMappingURL=CustoHxH.js.map