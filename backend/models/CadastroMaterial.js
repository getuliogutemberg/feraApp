const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CadastroMaterial = sequelize.define('CadastroMaterial', {
  cod_item_material: {
    type: DataTypes.INTEGER
  },
  cod_itemmaterial_ext: {
    type: DataTypes.INTEGER
  },
  desc_material: {
    type: DataTypes.STRING
  },
  desc_numero_itemmaterial: {
    type: DataTypes.INTEGER
  },
  cod_unidade_medida: {
    type: DataTypes.STRING
  },
  cod_classematerial: {
    type: DataTypes.INTEGER
  },
  cod_grupo: {
    type: DataTypes.INTEGER
  }
}, {
  schema:'app',
  tableName: 'cadastro_material',
  timestamps: false
});

module.exports = CadastroMaterial;
 