const mongoose = require("mongoose");
require("dotenv/config");

const url = process.env.CONNECTION_URL;
mongoose.connect(url).then((retorno) => {
  console.log("Conectado ao Banco de Dados");
}).catch((err) => {
  console.log(err);
});

module.exports = mongoose;
