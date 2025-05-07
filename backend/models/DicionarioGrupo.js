const mongoose = require("mongoose");

const DicionarioGrupoSchema = new mongoose.Schema({
  cod_grupo: Number,
  desc_grupo: String,
});

module.exports = mongoose.model("dicionario_grupos",DicionarioGrupoSchema);