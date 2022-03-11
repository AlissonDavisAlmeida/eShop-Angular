const mongoose = require("mongoose");

const PedidosSchema = mongoose.Schema({

  itesmpedidos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "itesmpedidos",
    required: true,
  }],
  enderecoEntrega1: {
    type: String,
    required: true,
  },
  enderecoEntrega2: {
    type: String,
    required: true,
  },
  cidade: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  pais: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  precoTotal: {
    type: Number,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuario",

  },
  dataPedido: {
    type: Date,
    default: Date.now,
  },
});

const Pedidos = mongoose.model("pedidos", PedidosSchema);

module.exports = Pedidos;
