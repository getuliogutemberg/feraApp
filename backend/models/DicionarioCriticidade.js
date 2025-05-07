const mongoose = require("mongoose");

const DicionarioCriticidadeSchema = new mongoose.Schema({
  cod_criticidade: Number,
  data_criticidade: Date,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("DicionarioCriticidade", DicionarioCriticidadeSchema);