import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

// Interface para as propriedades do SubRoute
export interface SubRouteAttributes {
  id: string;
  name: string;
  path: string;
  icon?: string;
  component: string;
  requiredRole: string[];
  pageId?: string;
  reportId?: string;
  workspaceId?: string;
}

// Interface para as propriedades do MenuGroup
export interface MenuGroupAttributes {
  id: string;
  name: string;
  icon?: string;
  component: string;
  path: string;
  requiredRole: string[];
  subRoutes: SubRouteAttributes[];
  isDirectModule?: boolean;
  pageId?: string; 
  reportId?: string;
  workspaceId?: string;
}

// Interface para as propriedades que podem ser nulas na criação
interface MenuCreationAttributes extends Optional<MenuGroupAttributes, 'id'> {}

// Interface do modelo Menu
class Menu extends Model<MenuGroupAttributes, MenuCreationAttributes> implements MenuGroupAttributes {
  public id!: string;
  public name!: string;
  public icon!: string;
  public component!: string;
  public path!: string;
  public requiredRole!: string[];
  public subRoutes!: SubRouteAttributes[];
  public isDirectModule!: boolean;
  public pageId!: string;
  public reportId!: string;
  public workspaceId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Menu.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  component: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requiredRole: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  subRoutes: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  isDirectModule: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pageId: {  // Adicionar estes campos
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
  }
}, {
  sequelize,
  modelName: 'Menu',
  schema: 'internal',
  timestamps: true
});

export default Menu;