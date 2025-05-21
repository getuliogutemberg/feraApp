import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../../config/database";

// Interface para as propriedades do User
export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  RG?: string | null;
  password: string;
  category?: string | null;
  className?: string | null;
  refreshToken?: string | null;
  jwtSecret?: string | null;
  position: [number, number];
  customIcon?: string;
  status?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para as propriedades que podem ser nulas na criação
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'position' | 'customIcon' | 'status' | 'isActive'> {}

// Interface do modelo User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public RG!: string | null;
  public password!: string;
  public category!: string | null;
  public className!: string | null;
  public refreshToken!: string | null;
  public jwtSecret!: string | null;
  public position!: [number, number];
  public customIcon!: string;
  public status!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  RG: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  className: {
    type: DataTypes.STRING
  },
  refreshToken: {
    type: DataTypes.STRING
  },
  jwtSecret: {
    type: DataTypes.STRING,
    allowNull: true
  },
  position: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    defaultValue: [0, 0]
  },
  customIcon: {
    type: DataTypes.STRING,
    defaultValue: 'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { 
  sequelize,
  modelName: 'User',
  schema: 'internal',
  timestamps: true
});

export default User;
