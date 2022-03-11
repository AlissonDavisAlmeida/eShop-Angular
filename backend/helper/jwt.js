const expressJwt = require("express-jwt");

const revoked = async (req, payload, done) => {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
};

const authGuardJwt = () => expressJwt({
  secret: process.env.SECRET_TOKEN,
  algorithms: ["HS256"],
  isRevoked: revoked,
}).unless({
  path: [
    { url: /\/api\/v1\/produtos(.*)/, methods: ["GET", "OPTIONS"] },
    { url: /\/api\/v1\/categorias(.*)/, methods: ["GET", "OPTIONS"] },
    { url: /\/api\/v1\/usuarios(.*)/, methods: ["GET", "OPTIONS"] },
    { url: /\/api\/v1\/pedidos(.*)/, methods: ["GET", "OPTIONS"] },
    { url: /\/public(.*)/, methods: ["GET", "OPTIONS"] },
    `/api/v1/usuarios/login`,
    `/api/v1/usuarios/signup`,

  ],
});

module.exports = authGuardJwt;
