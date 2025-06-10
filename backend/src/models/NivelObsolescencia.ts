import { DataTypes } from 'sequelize';
import sequelize from '../../config/database';

const NivelObsolescencia = sequelize.define('nivel_obsolescencia', {
  cod_equipamento: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true,
  },
  peso_parametro: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
}, {
  schema: 'internal',
  tableName: 'nivel_obsolescencia',
  timestamps: false,
});

export default NivelObsolescencia; 