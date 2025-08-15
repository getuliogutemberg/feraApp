"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class EquipamentoManut extends sequelize_1.Model {
}
EquipamentoManut.init({
    f_equipamento: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: false,
    },
    f_familia: sequelize_1.DataTypes.STRING,
    f_desc_familia: sequelize_1.DataTypes.STRING,
    f_localizao: sequelize_1.DataTypes.STRING,
    f_numero_operacional: sequelize_1.DataTypes.STRING,
    f_cod_tuc: sequelize_1.DataTypes.DOUBLE,
    f_desc_tuc: sequelize_1.DataTypes.STRING,
    f_tipo_serv_agrupado: sequelize_1.DataTypes.STRING,
    f_ano: sequelize_1.DataTypes.INTEGER,
    f_hxh_valor: sequelize_1.DataTypes.DOUBLE,
    f_proporc_planejamento: sequelize_1.DataTypes.DOUBLE,
    f_proporc_deslocamento: sequelize_1.DataTypes.DOUBLE,
    f_hxh_decimal: sequelize_1.DataTypes.DOUBLE,
    f_custo_servico: sequelize_1.DataTypes.DOUBLE,
    f_qtd_manutencoes: sequelize_1.DataTypes.DOUBLE,
}, {
    sequelize: database_1.default,
    modelName: 'EquipamentoManut',
    tableName: 'equipamentos_manut',
    schema: 'silver',
    timestamps: false,
});
exports.default = EquipamentoManut;
//# sourceMappingURL=EquipamentoManut.js.map