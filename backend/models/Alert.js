const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  type: {
    type: DataTypes.STRING
  },
  title: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  color: {
    type: DataTypes.STRING
  },
  icon: {
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

module.exports = Alert;
