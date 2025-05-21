import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

// Interface para as propriedades do Alert
export interface AlertAttributes {
  id?: number;
  type: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação (com campos opcionais)
interface AlertCreationAttributes extends Optional<AlertAttributes, 'id' | 'deletedAt'> {}

class Alert extends Model<AlertAttributes, AlertCreationAttributes> implements AlertAttributes {
  public id!: number;
  public type!: string;
  public title!: string;
  public description!: string;
  public color!: string;
  public icon!: string;
  public deletedAt!: Date | null;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Alert.init({
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  sequelize,
  modelName: 'Alert',
  schema: 'internal',
  timestamps: true,
  paranoid: true, // Habilita soft delete (usa deletedAt)
});

export default Alert;