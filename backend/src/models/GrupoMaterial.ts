import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

// Interface for GrupoMaterial attributes
export interface GrupoMaterialAttributes {
  id?: number;
  cod_item_material: number;
  cod_grupo: number;
  data_grupo?: Date | null;
}

class GrupoMaterial extends Model<GrupoMaterialAttributes> implements GrupoMaterialAttributes {
  public id!: number;
  public cod_item_material!: number;
  public cod_grupo!: number;
  public data_grupo!: Date | null;

  // Timestamps (even though timestamps: false, we declare them as optional)
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

GrupoMaterial.init({
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
  data_grupo: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: 'A data do grupo deve ser uma data válida',
        args: true
      }
    }
  }
}, {
  sequelize,
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

export default GrupoMaterial;