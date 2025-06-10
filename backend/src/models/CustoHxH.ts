import { DataTypes } from 'sequelize';
import sequelize from '../../config/database';

const CustoHxH = sequelize.define('custo_hxh', {
  tuc: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  ano_inicio_validade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  custo_hxh: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  schema: 'internal',
  tableName: 'custo_hxh',
  timestamps: false,
});

export default CustoHxH; 