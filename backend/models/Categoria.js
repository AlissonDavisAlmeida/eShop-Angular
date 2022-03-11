const mongoose = require("mongoose");

const CategoriaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});

const Categorias = mongoose.model("categorias", CategoriaSchema);

module.exports = Categorias;
