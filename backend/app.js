const cors = require("cors");
const express = require("express");

const app = express();

const morgan = require("morgan");

const mongoose = require("./database/connection");
const rotaCategorias = require("./routers/categorias");
const rotaPedidos = require("./routers/pedidos");

const rotaProdutos = require("./routers/produtos");
const rotaUsuarios = require("./routers/usuarios");

const authGuardJwt = require("./helper/jwt");
const errorMidleware = require("./helper/errorMidleware");

const apiUrl = process.env.API_URL;

app.use(cors());
app.options("*", cors());
require("dotenv/config");

app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static("public"));
app.use(authGuardJwt());
app.use(errorMidleware);
app.use(express.static("public"));

app.use(`${apiUrl}/produtos`, rotaProdutos);
app.use(`${apiUrl}/pedidos`, rotaPedidos);
app.use(`${apiUrl}/categorias`, rotaCategorias);
app.use(`${apiUrl}/usuarios`, rotaUsuarios);

app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
