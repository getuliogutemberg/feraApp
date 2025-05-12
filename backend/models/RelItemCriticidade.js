const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RelItemCriticidade = sequelize.define('RelItemCriticidade', {
  cod_grupo: {
    type: DataTypes.INTEGER
  },
  desc_grupo: {
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

module.exports = RelItemCriticidade;