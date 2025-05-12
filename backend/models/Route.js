const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  component: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requiredRole: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  pageId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reportId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  workspaceId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
   schema:'app',
  timestamps: true
});

module.exports = Route;
