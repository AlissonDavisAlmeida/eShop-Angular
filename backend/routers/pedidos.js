const express = require("express");
const ItemsPedido = require("../models/ItemsPedido");

const rotaPedidos = express.Router();

const Pedidos = require("../models/Pedidos");

rotaPedidos.get(`/`, (req, res) => {
  const listaPedidos = Pedidos.find().populate("usuario", "nome email -_id")
    .populate({ path: "itesmpedidos", populate: { path: "produtos", select: "nome descricao" } })
    .sort({ dataPedido: -1 })
    .then((pedidos) => {
      if (!pedidos) {
        return res.status(500).json({
          mensagem: "Nenhum pedido encontrado",
        });
      }

      res.status(200).json({
        pedidos,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

rotaPedidos.get(`/:id`, (req, res) => {
  const { id } = req.params;
  Pedidos.findById(id).populate("usuario", "nome email -_id").populate({ path: "itesmpedidos", populate: { path: "produtos", select: "nome descricao" } }).then((pedidos) => {
    if (!pedidos) {
      return res.status(500).json({
        mensagem: "Nenhum pedido encontrado",
      });
    }

    res.status(200).json({
      pedidos,
    });
  })
    .catch((err) => {
      console.log(err);
    });
});

rotaPedidos.get(`/get/totalsales`, async (req, res) => {
  const totalSales = await Pedidos.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$precoTotal" } } },
  ]);

  if (!totalSales) {
    return res.status(400).json({
      mensagem: "As vendas dos pedidos não podem ser geradas",
    });
  }

  return res.status(200).json({
    totalVendas: totalSales.pop().totalSales,
  });
});

rotaPedidos.get(`/get/count`, async (req, res) => {
  Pedidos.count().then((retorno) => res.status(200).json({
    quantidadePedidos: retorno,
  })).catch((err) => res.status(500).json({
    mensagem: "Ocorreu um erro",
    err,
  }));
});

rotaPedidos.post("/", async (req, res) => {
  const {
    itemsPedido,
    enderecoEntrega1,
    enderecoEntrega2,
    cidade,
    cep,
    pais,
    telefone,

    usuario,
  } = req.body;

  const itemsPedidoID = Promise.all(itemsPedido.map(async (itemPedido) => {
    let newItemPedido = new ItemsPedido({
      quantidade: itemPedido.quantidade,
      produtos: itemPedido.produtos,
    });

    newItemPedido = await newItemPedido.save();

    return newItemPedido._id;
  }));

  const orderItemsIdsResolved = await itemsPedidoID;

  const totalPedido = await Promise.all(orderItemsIdsResolved.map(async (ordemItemID) => {
    const ordemItem = await ItemsPedido.findById(ordemItemID).populate("produtos", "preco");
    const precoTotal = ordemItem.produtos.preco * ordemItem.quantidade;
    return precoTotal;
  }));

  const total = totalPedido.reduce((acc, atual) => acc + atual, 0);
  console.log(orderItemsIdsResolved);
  const pedido = new Pedidos({
    itesmpedidos: orderItemsIdsResolved,
    enderecoEntrega1,
    enderecoEntrega2,
    cidade,
    cep,
    pais,
    telefone,
    precoTotal: total,
    usuario,
  });

  const pedidoSave = await pedido.save();

  if (!pedidoSave) {
    return res.status(400).json({
      mensagem: "Ocorreu um erro no pedido",
    });
  }

  return res.status(200).json({
    mensagem: "Pedido criado com sucesso",

  });
});

rotaPedidos.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  Pedidos.findByIdAndUpdate(id, { status }, { new: true }).then((retorno) => res.status(200).json({
    retorno,
  })).catch((erro) => res.status(400).json({
    mensagem: "Ocorreu um erro na atualização do status do pedido",
    erro,
  }));
});

rotaPedidos.delete("/:id", async (req, res) => {
  const { id } = req.params;

  Pedidos.findByIdAndRemove(id).then(async (retorno) => {
    if (retorno) {
      await retorno.itesmpedidos.map(async (orderItem) => {
        await ItemsPedido.findByIdAndRemove(orderItem);
      });
      return res.status(200).json({
        mensagem: "Pedido removido com sucesso",
      });
    }
    return res.status(404).json({
      mensagem: "O pedido não foi encontrado",
    });
  }).catch((erro) => res.status(400).json({
    mensagem: "Ocorreu um erro na remoção do pedido",
    erro,
  }));
});

rotaPedidos.get("/get/userOrders/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const listaPedidos = await Pedidos.find({ usuario: userId })
      .populate({ path: "itesmpedidos", select: "-_id", populate: { path: "produtos", select: "nome descricao -_id" } })
      .populate({ path: "usuario", select: "-passwordHash" })
      .sort({ dataPedido: -1 });

    if (!listaPedidos) {
      return res.status(500).json({
        mensagem: "Não existem pedidos cadastrados para esse usuário",
      });
    }

    return res.status(200).json({
      listaPedidos,
    });
  } catch (erro) {
    return res.status(400).json({
      mensagem: "Ocorreu um erro na busca dos pedidos",
      erro,
    });
  }
});

module.exports = rotaPedidos;
