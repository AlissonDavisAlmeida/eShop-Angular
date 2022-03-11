const errorMidleware = (err, req, res, next) => {
  if (err) {
    return res.status(500).json({
      mensagem: "ocorreu um erro",
      err,
    });
  }
  next();
};

module.exports = errorMidleware;
