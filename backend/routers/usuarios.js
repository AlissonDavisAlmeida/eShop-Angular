const express = require('express');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const rotaUsuarios = express.Router();

const mongoose = require('mongoose');
const Usuarios = require('../models/Usuarios');

rotaUsuarios.get('/', (req, res) => {
  Usuarios.find().select("-passwordHash").then((usuarios) => {
    if (!usuarios) {
      return res.status(500).json({
        mensagem: 'Não existe usuários cadastrados',
      });
    }

    res.status(200).json({
      usuarios,
    });
  }).catch((err) => {
    console.log(err);
  });
});

rotaUsuarios.post("/signup", async (req, res) => {
  const {
    nome, email, password, celular, isAdmin, rua, apartamento, cep, cidade, estado,
  } = req.body;

  const senhaHash = await bcrypt.hash(password, 10);

  const usuario = new Usuarios({
    nome, email, passwordHash: senhaHash, celular, isAdmin, rua, apartamento, cep, cidade, estado,
  });

  usuario.save().then((retorno) => {
    res.status(200).json({
      mensagem: "Usuário Salvo com sucesso",
      retorno,
    });
  }).catch((erro) => {
    console.log(`Ocorreu um erro: ${erro}`);
    res.status(400).json({
      mensagem: "Ocorreu um erro para salvar o usuário",
      erro,
    });
  });
});

rotaUsuarios.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuarios.findById({ _id: id }).select("-passwordHash");

    if (!usuario) {
      res.status(500).json({
        mensagem: "Usuário não encontrado",
      });
    }
    res.status(200).json({
      usuario,
    });
  } catch (erro) {
    res.status(400).json({
      mensagem: "Ocorreu um erro",
      erro,
    });
  }
});

rotaUsuarios.put("/:id", async (req, res) => {
  const { id } = req.params;

  const {
    nome, email, password, celular, isAdmin, rua, apartamento, cep, cidade, estado,
  } = req.body;

  const user = await Usuarios.findById({ _id: id });
  const senhaHash = password ? await bcrypt.hash(password, 10) : user.passwordHash;

  Usuarios.findByIdAndUpdate({ _id: id }, {
    nome, email, passwordHash: senhaHash, celular, isAdmin, rua, apartamento, cep, cidade, estado,
  }, { new: true })
    .then((retorno) => {
      res.status(200).json({
        mensagem: "Usuário atualizado com sucesso",
        retorno,
      });
    })
    .catch((erro) => {
      res.status(500).json({
        mensagem: "Ocorreu um erro na atualização do usuário",
        erro,
      });
    });
});

rotaUsuarios.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await Usuarios.findOne({ email });

  if (!usuario) {
    return res.status(400).json({
      mensagem: "Usuário não encontrado",
    });
  }

  const isSenhaTrue = bcrypt.compareSync(senha, usuario.passwordHash);

  if (!isSenhaTrue) {
    return res.status(500).json({
      mensagem: "A senha está incorreta",
    });
  }

  const secret = process.env.SECRET_TOKEN;
  const token = jwt.sign({
    userId: usuario._id,
    isAdmin: usuario.isAdmin,
  }, secret, { expiresIn: "1d", algorithm: "HS256" });

  return res.status(200).json({
    mensagem: "Usuário autorizado para fazer login",
    email: usuario.email,
    token,
  });
});

rotaUsuarios.get("/get/count", (req, res) => {
  Usuarios.count().then((retorno) => res.status(200).json({
    quantidadeUsuarios: retorno,
  })).catch((erro) => res.status(500).json({
    mensagem: "Ocorreu um erro",
    erro,
  }));
});

rotaUsuarios.delete("/:id", (req, res) => {
  const { id } = req.params;

  const isValidId = mongoose.isValidObjectId(id);

  if (!isValidId) {
    return res.status(500).json({
      mensagem: "O id informado não é um id válido no MongoDB",

    });
  }

  Usuarios.findByIdAndRemove(id).then((retorno) => res.status(200).json({
    mensagem: "Usuário excluido com sucesso",
    retorno,
  })).catch((erro) => res.status(400).json({
    mensagem: "Ocorreu um erro",
    erro,
  }));
});

module.exports = rotaUsuarios;
