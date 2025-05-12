const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DicionarioCriticidade = sequelize.define('DicionarioCriticidade', {
  cod_criticidade: {
    type: DataTypes.INTEGER
  },
  data_criticidade: {
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  schema:'internal',
  timestamps: true
});

module.exports = DicionarioCriticidade;