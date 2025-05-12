const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  RG: String,
  password: String,
  category: String,
  className: String,
  refreshToken: String,
  position: { type: [Number], default: [0, 0] },
  customIcon: { type: String, default: 'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png' },
  createAt: { type: String, default: new Date },
  updateAt: { type: String, default: new Date },
  status: { type: String, default: '' },
  isActive: { type: Boolean, default: false },
}, { 
  schema:'internal',
  timestamps: true
 });

module.exports = mongoose.model("User", UserSchema);
