const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  type: String,
  title: String,
  description: String,
  color: String,
  icon: String,
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Alert", AlertSchema);
