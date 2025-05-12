const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DicionarioGrupo = sequelize.define('DicionarioGrupo', {
  cod_grupo: {
    type: DataTypes.INTEGER
  },
  desc_grupo: {
    type: DataTypes.STRING
  }
}, {
  schema:'internal',
  tableName: 'dicionario_grupos',
  timestamps: false
});

module.exports = DicionarioGrupo;