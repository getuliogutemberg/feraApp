const mongoose = require("mongoose");

const EstrategiaParametrosSchema = new mongoose.Schema({
  cod_grupo: Number,
  cod_item_material: Number,
  client: String,
  cods_parametro: [Number],
  cods_opcao: [Number],
  data_estrategia: Date,
});

module.exports = mongoose.model("estrategia_parametros", EstrategiaParametrosSchema);