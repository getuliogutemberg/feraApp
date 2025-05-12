const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UnidadeMaterial = sequelize.define('UnidadeMaterial', {
  cod_unidade: {
    type: DataTypes.INTEGER
  },
  desc_unidade: {
    type: DataTypes.STRING
  },
  deletedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  schema:'app',
  timestamps: true
});

module.exports = UnidadeMaterial;