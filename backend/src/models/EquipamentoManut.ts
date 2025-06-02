import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class EquipamentoManut extends Model {}

EquipamentoManut.init({
  f_equipamento: {
    type: DataTypes.STRING,
    primaryKey: false,
  },
  f_familia: DataTypes.STRING,
  f_desc_familia: DataTypes.STRING,
  f_localizao: DataTypes.STRING,
  f_numero_operacional: DataTypes.STRING,
  f_cod_tuc: DataTypes.DOUBLE,
  f_desc_tuc: DataTypes.STRING,
  f_tipo_serv_agrupado: DataTypes.STRING,
  f_ano: DataTypes.INTEGER,
  f_hxh_valor: DataTypes.DOUBLE,
  f_proporc_planejamento: DataTypes.DOUBLE,
  f_proporc_deslocamento: DataTypes.DOUBLE,
  f_hxh_decimal: DataTypes.DOUBLE,
  f_custo_servico: DataTypes.DOUBLE,
  f_qtd_manutencoes: DataTypes.DOUBLE,
}, {
  sequelize,
  modelName: 'EquipamentoManut',
  tableName: 'equipamentos_manut',
  schema: 'silver',
  timestamps: false,
});

export default EquipamentoManut; 