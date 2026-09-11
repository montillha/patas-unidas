const jwt = require('jsonwebtoken');
const { ErroDeAutenticacao, ErroDeAutorizacao } = require('../utils/errors');

function autenticar(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) throw new ErroDeAutenticacao('Não autenticado.');
    req.conta = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(new ErroDeAutenticacao('Não autenticado.'));
  }
}

function autorizarTipo(...tipos) {
  return (req, res, next) => {
    if (!tipos.includes(req.conta?.tipo)) {
      return next(new ErroDeAutorizacao('Acesso não permitido para este tipo de conta.'));
    }
    next();
  };
}

module.exports = { autenticar, autorizarTipo };
