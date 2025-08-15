"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class GrupoMaterial extends sequelize_1.Model {
}
GrupoMaterial.init({
    cod_item_material: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O código do item material é obrigatório'
            },
            isInt: {
                msg: 'O código do item material deve ser um número inteiro'
            }
        }
    },
    cod_grupo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O código do grupo é obrigatório'
            },
            isInt: {
                msg: 'O código do grupo deve ser um número inteiro'
            }
        }
    },
    data_grupo: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
        validate: {
            isDate: {
                msg: 'A data do grupo deve ser uma data válida',
                args: true
            }
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'GrupoMaterial',
    schema: 'internal',
    tableName: 'grupo_material',
    timestamps: false,
    indexes: [
        {
            fields: ['cod_item_material'],
            name: 'idx_grupo_material_cod_item'
        },
        {
            fields: ['cod_grupo'],
            name: 'idx_grupo_material_cod_grupo'
        },
        {
            fields: ['cod_item_material', 'cod_grupo'],
            unique: true,
            name: 'uq_grupo_material_item_grupo'
        }
    ]
});
exports.default = GrupoMaterial;
//# sourceMappingURL=GrupoMaterial.js.map