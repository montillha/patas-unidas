const authService = require('../services/authService');

async function criar(req, res, next) {
  try {
    const usuario = await authService.cadastrarUsuario(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    next(err);
  }
}

module.exports = { criar };
