const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GrupoMaterial = sequelize.define('GrupoMaterial', {
  cod_item_material: {
    type: DataTypes.INTEGER
  },
  cod_grupo: {
    type: DataTypes.INTEGER
  },
  data_grupo: {
    type: DataTypes.DATE
  }
}, {
  schema:'app',
  tableName: 'grupo_material',
  timestamps: false
});

module.exports = GrupoMaterial;