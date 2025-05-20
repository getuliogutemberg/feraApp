import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

// Interface para as propriedades do DicionarioGrupo
export interface DicionarioGrupoAttributes {
  id?: number; // Adicionado campo id que é padrão no Sequelize
  cod_grupo: number;
  desc_grupo: string;
}

class DicionarioGrupo extends Model<DicionarioGrupoAttributes> implements DicionarioGrupoAttributes {
  public id!: number;
  public cod_grupo!: number;
  public desc_grupo!: string;
}

DicionarioGrupo.init({
  cod_grupo: {
    type: DataTypes.INTEGER,
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
    type: DataTypes.STRING,
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
  sequelize,
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

export default DicionarioGrupo;