import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface para as propriedades do Route
export interface RouteAttributes {
  id?: number;
  path: string;
  component: string;
  name: string;
  requiredRole: string[];
  pageId?: string | null;
  reportId?: string | null;
  workspaceId?: string | null;
  icon?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para as propriedades que podem ser nulas na criação
interface RouteCreationAttributes extends Optional<RouteAttributes, 'id' | 'requiredRole'> {}

// Interface do modelo Route
class Route extends Model<RouteAttributes, RouteCreationAttributes> implements RouteAttributes {
  public id!: number;
  public path!: string;
  public component!: string;
  public name!: string;
  public requiredRole!: string[];
  public pageId!: string | null;
  public reportId!: string | null;
  public workspaceId!: string | null;
  public icon!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Route.init({
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  component: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requiredRole: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  pageId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reportId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  workspaceId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Route',
  schema: 'internal',
  timestamps: true
});

export default Route;
