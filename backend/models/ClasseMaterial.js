const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClasseMaterial = sequelize.define('ClasseMaterial', {
  cod_classematerial: {
    type: DataTypes.INTEGER
  },
  desc_classemat: {
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

module.exports = ClasseMaterial;
