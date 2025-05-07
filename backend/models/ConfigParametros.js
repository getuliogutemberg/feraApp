const mongoose = require("mongoose");

const ConfigParametrosSchema = new mongoose.Schema({
  client: String,
  cod_parametro: Number,
  cod_opcao: Number,
  desc_parametro: String,
  desc_opcao: String,
  tipo: {
    type: String,
    enum: ['boolean', 'radio'],
    required: true
  },
  opcoes: [{
    cod_opcao: Number,
    desc_opcao: String
  }]
});

module.exports = mongoose.model("config_parametros", ConfigParametrosSchema);