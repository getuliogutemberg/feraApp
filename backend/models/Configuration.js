const mongoose = require("mongoose");

const ConfigurationSchema = new mongoose.Schema({
  notifications: { type: Boolean, default: true },
  allowRegister: { type: Boolean, default: false },
  allowRequireRegister: { type: Boolean, default: false },
  allowNewCategory: { type: Boolean, default: false },
  allowNewClassName: { type: Boolean, default: false },
  addSecretKey: { type: Boolean, default: false },
  addCategory: { type: Boolean, default: true },
  fontFamily: { type: String, default: "Arial" },
  pageTitle: { type: String, default: "Configurações" },
  themeMode: { type: String, enum: ["light", "dark"], default: "light" },
  primaryColor: { type: Number, default: 56 },
  secondaryColor: { type: Number, default: 180 },
  backgroundColor: { type: Number, default: 0 },
  textColor: { type: Number, default: 0 },
  pbiKeys: {
    clientId: { type: String, default: "b918d10b-19f4-44c3-a58e-36e311e734ce" },
    clientSecret: { type: String, default: "dmZ8Q~Nmgk-9wiaO2Wxe6qRc8TZI.MZ8ob3psaP5" },
    authority: { type: String, default: "https://login.microsoftonline.com/80899d73-a5f2-4a53-b252-077af6003b36" },
  },
}, { timestamps: true });

module.exports = mongoose.model("Configuration", ConfigurationSchema);
