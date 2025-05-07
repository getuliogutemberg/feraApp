const mongoose = require("mongoose");

const UnidadeMaterialSchema = new mongoose.Schema({
  cod_unidade: Number,
  desc_unidade: String,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("UnidadeMaterial",UnidadeMaterialSchema);