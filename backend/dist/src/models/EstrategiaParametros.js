"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class EstrategiaParametros extends sequelize_1.Model {
}
EstrategiaParametros.init({
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
    client: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O cliente é obrigatório'
            },
            len: {
                args: [1, 100],
                msg: 'O nome do cliente deve ter entre 1 e 100 caracteres'
            }
        }
    },
    cods_parametro: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
        validate: {
            isArrayOfIntegers(value) {
                if (!Array.isArray(value) || !value.every(Number.isInteger)) {
                    throw new Error('Deve ser um array de números inteiros');
                }
            }
        }
    },
    cods_opcao: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
        validate: {
            isArrayOfIntegers(value) {
                if (!Array.isArray(value) || !value.every(Number.isInteger)) {
                    throw new Error('Deve ser um array de números inteiros');
                }
            }
        }
    },
    data_estrategia: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
        validate: {
            isDate: {
                msg: 'A data da estratégia deve ser uma data válida',
                args: true
            }
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'EstrategiaParametros',
    schema: 'internal',
    tableName: 'estrategia_parametros',
    timestamps: false,
    indexes: [
        {
            fields: ['cod_grupo'],
            name: 'idx_estrategia_cod_grupo'
        },
        {
            fields: ['cod_item_material'],
            name: 'idx_estrategia_cod_item'
        },
        {
            fields: ['client'],
            name: 'idx_estrategia_client'
        },
        {
            fields: ['cod_grupo', 'cod_item_material'],
            unique: true,
            name: 'uq_estrategia_grupo_item'
        }
    ]
});
exports.default = EstrategiaParametros;
//# sourceMappingURL=EstrategiaParametros.js.map