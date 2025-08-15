"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const NivelObsolescencia = database_1.default.define('nivel_obsolescencia', {
    cod_equipamento: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
    },
    peso_parametro: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    schema: 'internal',
    tableName: 'nivel_obsolescencia',
    timestamps: false,
});
exports.default = NivelObsolescencia;
//# sourceMappingURL=NivelObsolescencia.js.map