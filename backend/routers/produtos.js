const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("tipo de imagem inválida");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/images');
  },
  filename(req, file, cb) {
    const extension = FILE_TYPE_MAP[file.mimetype];
    const filename = file.originalname.split(" ").join("-");
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage });

const rotaProdutos = express.Router();
const Categorias = require("../models/Categoria");
const Produtos = require("../models/Produtos");

rotaProdutos.post(`/`, upload.single("imagem"), async (requisicao, resposta) => {
  const { filename } = requisicao.file;
  const basePathImages = `${requisicao.protocol}://${requisicao.hostname}/public/images/`;

  const {
    nome,
    descricao,
    richDescription,
    brand,
    preco,
    categoria,
    countInStock,
    rating,
    numReviews,
    isFeature,
  } = requisicao.body;

  if (!filename) {
    return resposta.status(400).json({
      mensagem: "Não existe imagem na requisição",
    });
  }

  const categoriaId = await Categorias.findById({ _id: categoria });
  if (!categoriaId) {
    return resposta.status(400).json({
      mensagem: "A categoria passada é inválida",
    });
  }

  const novoProduto = new Produtos({
    nome,
    descricao,
    richDescription,
    imagem: `${basePathImages}${filename}`,
    brand,
    preco,
    categoria,
    countInStock,
    rating,
    numReviews,
    isFeature,
  });

  novoProduto.save().then((produto) => {
    console.log(produto);
    if (!produto) {
      return resposta.status(500).json({
        mensagem: "Não foi possível salvar o produto, verifique as informações passadas",
      });
    }
    resposta.json({
      mensagem: "Produtos inseridos com sucesso",
      produto,
    });
  }).catch((erro) => {
    console.log(erro);
    return resposta.status(400).json({
      mensagem: "Ocorreu um erro na criação de um novo produto",
      erro,
    });
  });
});

rotaProdutos.get(`/`, async (req, res) => {
  const { categorias } = req.query;
  let filter = {};
  if (categorias) {
    filter = { categoria: categorias.split(",") };
  }
  const listaProdutos = await Produtos.find(filter).populate("categoria");

  res.json({
    listaProdutos,
  });
});

rotaProdutos.get("/quantidade/prod", (req, res) => {
  Produtos.count().then((retorno) => res.status(200).json({
    quantidadeProdutos: retorno,
  })).catch((err) => res.status(500).json({
    mensagem: "Ocorreu um erro",
    err,
  }));
});

rotaProdutos.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(500).json({
      mensagem: "O campo id não está preenchido corretamente",
    });
  }

  const produto = await Produtos.findById(id).select("nome imagem -_id").populate('categoria');

  if (!produto) {
    return res.status(500).json({
      mensagem: "Ocorreu um erro na busca pelo id",

    });
  }

  return res.status(200).json({
    produto,
  });
});

rotaProdutos.put("/:id", upload.single("imagem"), async (req, res) => {
  const { id } = req.params;

  const {
    nome,
    descricao,
    richDescription,
    imagem,
    brand,
    preco,
    categoria,
    countInStock,
    rating,
    numReviews,
    isFeature,
  } = req.body;

  const categoriaId = await Categorias.findById(categoria);

  if (!categoriaId) {
    return res.status(500).json({
      mensagem: "A categoria informada não existe",
    });
  }

  const produto = await Produtos.findById(id);
  if (!produto) {
    return res.status(400).json({
      mensagem: "o Id do produto é inválido",
    });
  }
  const { filename } = req.file;
  let imagePath;

  if (filename) {
    const basePath = `${req.protocol}://${req.hostname}/public/images/`;
    imagePath = `${basePath}${filename}`;
  } else {
    imagePath = produto.imagem;
  }

  Produtos.findByIdAndUpdate(id, {
    nome,
    descricao,
    richDescription,
    imagem: imagePath,
    brand,
    preco,
    categoria,
    countInStock,
    rating,
    numReviews,
    isFeature,
  }, { new: true }).then((valor) => res.status(200).json({
    valor,
  }), (erro) => res.status(500).json({
    mensagem: "Ocorreu um erro na atualização do produto",
    erro,
  }));
});

rotaProdutos.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = Produtos.findByIdAndDelete(id);

    return res.status(200).json({
      mensagem: "Produto excluido com sucesso",
      resultado,
    });
  } catch (erro) {
    return res.status(500).json({
      mensagem: "Ocorreu um erro na operação de remoção do produto",
      erro,
    });
  }
});

rotaProdutos.put("/gallery-images/:id", upload.array("images", 10), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      mensagem: "ID do Produto inválido",
    });
  }
  const { files } = req;
  const imagesPaths = [];
  const basePathImages = `${req.protocol}://${req.hostname}/public/images/`;
  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePathImages}${file.fileName}`);
    });
  }

  Produtos.findByIdAndUpdate(id, {
    imagens: imagesPaths,
  }, { new: true }).then((valor) => res.status(200).json({
    valor,
  }), (erro) => res.status(500).json({
    mensagem: "Ocorreu um erro na atualização do produto",
    erro,
  }));
});

rotaProdutos.get("/get/featured/:count", (req, res) => {
  const { count } = req.params ? req.params : 0;
  Produtos.find({ isFeature: true }).limit(count).then((produtos) => {
    res.status(200).json({
      produtos,
      count,
    });
  }).catch((erro) => {
    res.status(500).json({
      mensagem: "Ocorreu um erro na busca dos produtos em promoção",
      erro,
    });
  });
});

module.exports = rotaProdutos;
