import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

// Interface para EstrategiaParametros 
export interface EstrategiaParametrosAttributes {
  id?: number;
  cod_grupo: number;
  cod_item_material: number;
  client: string;
  cods_parametro: number[];
  cods_opcao: number[];
  data_estrategia?: Date | null;
}

class EstrategiaParametros extends Model<EstrategiaParametrosAttributes> implements EstrategiaParametrosAttributes {
  public id!: number;
  public cod_grupo!: number;
  public cod_item_material!: number;
  public client!: string;
  public cods_parametro!: number[];
  public cods_opcao!: number[];
  public data_estrategia!: Date | null;
}

EstrategiaParametros.init({
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
  cod_item_material: {
    type: DataTypes.INTEGER,
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
    type: DataTypes.STRING(100),
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
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: [],
    validate: {
      isArrayOfIntegers(value: number[]) {
        if (!Array.isArray(value) || !value.every(Number.isInteger)) {
          throw new Error('Deve ser um array de números inteiros');
        }
      }
    }
  },
  cods_opcao: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: [],
    validate: {
      isArrayOfIntegers(value: number[]) {
        if (!Array.isArray(value) || !value.every(Number.isInteger)) {
          throw new Error('Deve ser um array de números inteiros');
        }
      }
    }
  },
  data_estrategia: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: 'A data da estratégia deve ser uma data válida',
        args: true
      }
    }
  }
}, {
  sequelize,
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

export default EstrategiaParametros;