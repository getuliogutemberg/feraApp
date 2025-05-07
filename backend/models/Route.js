const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  path: { type: String, required: true },
  component: { type: String, required: true },
  requiredRole: { type: [String], default: [] },
  pageId: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("Route", RouteSchema);
