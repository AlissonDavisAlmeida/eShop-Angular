const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  celular: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  rua: {
    type: String,
    default: '',
  },
  apartamento: {
    type: String,
    default: '',
  },
  cep: {
    type: String,
    default: '',
  },
  cidade: {
    type: String,
    default: '',
  },
  estado: {
    type: String,
    default: '',
  },
});

UsuarioSchema.virtual('id').get(() => this._id.toHexString());

UsuarioSchema.set('toJson', {
  virtuals: true,
});

const Usuario = mongoose.model('usuario', UsuarioSchema);

module.exports = Usuario;
