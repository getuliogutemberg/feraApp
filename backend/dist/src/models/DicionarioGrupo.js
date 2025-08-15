"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class DicionarioGrupo extends sequelize_1.Model {
}
DicionarioGrupo.init({
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
    desc_grupo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A descrição do grupo é obrigatória'
            },
            len: {
                args: [3, 255],
                msg: 'A descrição deve ter entre 3 e 255 caracteres'
            }
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'DicionarioGrupo',
    schema: 'internal',
    tableName: 'dicionario_grupos',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['cod_grupo']
        }
    ]
});
exports.default = DicionarioGrupo;
//# sourceMappingURL=DicionarioGrupo.js.map