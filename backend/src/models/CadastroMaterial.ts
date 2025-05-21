import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

// Interface para as propriedades do CadastroMaterial
export interface CadastroMaterialAttributes {
  id?: number;
  cod_item_material: number;
  cod_itemmaterial_ext?: number | null;
  desc_material: string;
  desc_numero_itemmaterial?: number | null;
  cod_unidade_medida: string;
  cod_classematerial: number;
  cod_grupo: number;
}

class CadastroMaterial extends Model<CadastroMaterialAttributes> implements CadastroMaterialAttributes {
  public id!: number;
  public cod_item_material!: number;
  public cod_itemmaterial_ext!: number | null;
  public desc_material!: string;
  public desc_numero_itemmaterial!: number | null;
  public cod_unidade_medida!: string;
  public cod_classematerial!: number;
  public cod_grupo!: number;
}

CadastroMaterial.init({
  cod_item_material: {
    type: DataTypes.INTEGER,
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
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'O código externo do item material deve ser um número inteiro'
      }
    }
  },
  desc_material: {
    type: DataTypes.STRING(255),
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
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'O número do item material deve ser um número inteiro'
      }
    }
  },
  cod_unidade_medida: {
    type: DataTypes.STRING(10),
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
    type: DataTypes.INTEGER,
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
  }
}, {
  sequelize,
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

export default CadastroMaterial;