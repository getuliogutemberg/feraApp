const mongoose = require("mongoose");

const DicionarioGrupoSchema = new mongoose.Schema({
  cod_grupo: Number,
  desc_grupo: String,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("DicionarioGrupo",DicionarioGrupoSchema);