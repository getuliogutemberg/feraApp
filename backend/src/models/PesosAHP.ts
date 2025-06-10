import { DataTypes } from 'sequelize';
import sequelize from '../../config/database';

const PesosAHP = sequelize.define('pesos_ahp', {
  parametro_1: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true,
  },
  parametro_2: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true,
  },
  nivel: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true,
  },
  peso_default: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  peso_usuario: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
}, {
  schema: 'internal',
  tableName: 'pesos_ahp',
  timestamps: false,
});

export default PesosAHP; 