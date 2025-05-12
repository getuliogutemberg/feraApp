const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Configuration = sequelize.define('Configuration', {
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
  schema:'app',
  timestamps: true
});

module.exports = Configuration;
