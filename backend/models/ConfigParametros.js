const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConfigParametros = sequelize.define('ConfigParametros', {
  client: {
    type: DataTypes.STRING
  },
  cod_parametro: {
    type: DataTypes.INTEGER
  },
  cod_opcao: {
    type: DataTypes.INTEGER
  },
  desc_parametro: {
    type: DataTypes.STRING
  },
  desc_opcao: {
    type: DataTypes.STRING
  },
  tipo: {
    type: DataTypes.ENUM('boolean', 'radio'),
    allowNull: false
  },
  opcoes: {
    type: DataTypes.JSONB
  }
}, {
  schema:'app',
  tableName: 'config_parametros',
  timestamps: false
});

module.exports = ConfigParametros;