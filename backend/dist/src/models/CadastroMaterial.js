"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class CadastroMaterial extends sequelize_1.Model {
}
CadastroMaterial.init({
    cod_item_material: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
            notNull: {
                msg: 'O código do item material é obrigatório'
            },
            isInt: {
                msg: 'O código do item material deve ser um número inteiro'
            }
        }
    },
    cod_itemmaterial_ext: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                msg: 'O código externo do item material deve ser um número inteiro'
            }
        }
    },
    desc_material: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A descrição do material é obrigatória'
            },
            len: {
                args: [3, 255],
                msg: 'A descrição deve ter entre 3 e 255 caracteres'
            }
        }
    },
    desc_numero_itemmaterial: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                msg: 'O número do item material deve ser um número inteiro'
            }
        }
    },
    cod_unidade_medida: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O código da unidade de medida é obrigatório'
            },
            len: {
                args: [1, 10],
                msg: 'O código da unidade deve ter até 10 caracteres'
            }
        }
    },
    cod_classematerial: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O código da classe de material é obrigatório'
            },
            isInt: {
                msg: 'O código da classe de material deve ser um número inteiro'
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
    }
}, {
    sequelize: database_1.default,
    modelName: 'CadastroMaterial',
    schema: 'internal',
    tableName: 'cadastro_material',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['cod_item_material']
        },
        {
            fields: ['cod_grupo']
        },
        {
            fields: ['cod_classematerial']
        }
    ]
});
exports.default = CadastroMaterial;
//# sourceMappingURL=CadastroMaterial.js.map