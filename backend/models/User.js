const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  RG: {
    type: DataTypes.STRING
  },
  password:  {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  className: {
    type: DataTypes.STRING
  },
  refreshToken: {
    type: DataTypes.STRING
  },
  position:  {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    defaultValue: [0, 0]
  },
  customIcon: {
    type: DataTypes.STRING,
    defaultValue: 'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png'
  }, // <-- Adiciona o ícone personalizado do usuário
  status: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, { 
  schema:'internal',
  timestamps: true
});

module.exports = User;
