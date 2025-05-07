const mongoose = require("mongoose");

const ClasseMaterialSchema = new mongoose.Schema({
  cod_classematerial: Number,
  desc_classemat: String,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("ClasseMaterial",ClasseMaterialSchema);
