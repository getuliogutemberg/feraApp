const mongoose = require("mongoose");

const GrupoMaterialSchema = new mongoose.Schema({
  cod_item_material: Number,
  cod_grupo: Number,
  data_grupo: Date,
});

module.exports = mongoose.model("grupo_material", GrupoMaterialSchema);