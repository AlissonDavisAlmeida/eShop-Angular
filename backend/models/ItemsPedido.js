const mongoose = require("mongoose");

const ItemsPedidoSchema = mongoose.Schema({
  quantidade: {
    type: Number,
    required: true,
  },
  produtos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "produtos",
    required: true,
  },
});

const ItemsPedido = mongoose.model("itesmpedidos", ItemsPedidoSchema);

module.exports = ItemsPedido;
