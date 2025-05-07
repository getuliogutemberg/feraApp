const mongoose = require("mongoose");

const CadastroMaterialSchema = new mongoose.Schema({
  cod_item_material: Number,
  cod_itemmaterial_ext: Number,
  desc_material: String,
  desc_numero_itemmaterial: Number,
  cod_unidade_medida: String,
  cod_classematerial: Number,
  cod_grupo: Number,
});

module.exports = mongoose.model("cadastro_material", CadastroMaterialSchema);
 