import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

// Interface para as propriedades da configuração
export interface ConfigurationAttributes {
  id?: number;
  notifications: boolean;
  allowRegister: boolean;
  allowRequireRegister: boolean;
  allowNewCategory: boolean;
  allowNewClassName: boolean;
  addSecretKey: boolean;
  addCategory: boolean;
  fontFamily: string;
  pageTitle: string;
  themeMode: 'light' | 'dark';
  primaryColor: number;
  secondaryColor: number;
  backgroundColor: number;
  textColor: number;
  pbiKeys: {
    clientId: string;
    clientSecret: string;
    authority: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação (com campos opcionais)
interface ConfigurationCreationAttributes extends Optional<ConfigurationAttributes, 'id'> {}

class Configuration extends Model<ConfigurationAttributes, ConfigurationCreationAttributes> 
  implements ConfigurationAttributes {
  
  public id!: number;
  public notifications!: boolean;
  public allowRegister!: boolean;
  public allowRequireRegister!: boolean;
  public allowNewCategory!: boolean;
  public allowNewClassName!: boolean;
  public addSecretKey!: boolean;
  public addCategory!: boolean;
  public fontFamily!: string;
  public pageTitle!: string;
  public themeMode!: 'light' | 'dark';
  public primaryColor!: number;
  public secondaryColor!: number;
  public backgroundColor!: number;
  public textColor!: number;
  public pbiKeys!: {
    clientId: string;
    clientSecret: string;
    authority: string;
  };
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Configuration.init({
  notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allowRegister: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allowRequireRegister: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allowNewCategory: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allowNewClassName: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  addSecretKey: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  addCategory: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fontFamily: {
    type: DataTypes.STRING,
    defaultValue: 'Arial'
  },
  pageTitle: {
    type: DataTypes.STRING,
    defaultValue: 'Configurações'
  },
  themeMode: {
    type: DataTypes.ENUM('light', 'dark'),
    defaultValue: 'light'
  },
  primaryColor: {
    type: DataTypes.INTEGER,
    defaultValue: 56
  },
  secondaryColor: {
    type: DataTypes.INTEGER,
    defaultValue: 180
  },
  backgroundColor: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  textColor: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pbiKeys: {
    type: DataTypes.JSONB,
    defaultValue: {
      clientId: 'b918d10b-19f4-44c3-a58e-36e311e734ce',
      clientSecret: 'dmZ8Q~Nmgk-9wiaO2Wxe6qRc8TZI.MZ8ob3psaP5',
      authority: 'https://login.microsoftonline.com/80899d73-a5f2-4a53-b252-077af6003b36'
    }
  }
}, {
  sequelize,
  modelName: 'Configuration',
  schema: 'internal',
  timestamps: true
});

export default Configuration;
