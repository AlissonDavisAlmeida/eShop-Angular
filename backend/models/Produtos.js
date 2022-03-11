const mongoose = require("mongoose");

const ProdutoSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },

  imagem: {
    type: String,
    default: "",
  },
  imagens: [{
    type: String,
  }],
  brand: {
    type: String,
    default: "",
  },
  preco: {
    type: Number,
    default: 0,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categorias",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeature: {
    type: Boolean,
    default: false,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },

});

const Produtos = mongoose.model("produtos", ProdutoSchema);

module.exports = Produtos;
