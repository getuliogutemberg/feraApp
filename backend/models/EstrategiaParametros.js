const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstrategiaParametros = sequelize.define('EstrategiaParametros', {
  cod_grupo: {
    type: DataTypes.INTEGER
  },
  cod_item_material: {
    type: DataTypes.INTEGER
  },
  client: {
    type: DataTypes.STRING
  },
  cods_parametro: {
    type: DataTypes.ARRAY(DataTypes.INTEGER)
  },
  cods_opcao: {
    type: DataTypes.ARRAY(DataTypes.INTEGER)
  },
  data_estrategia: {
    type: DataTypes.DATE
  }
}, {
  schema:'internal',
  tableName: 'estrategia_parametros',
  timestamps: false
});

module.exports = EstrategiaParametros;