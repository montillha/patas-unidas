const localizacaoService = require('../services/localizacaoService');

async function listarEstados(req, res, next) {
  try {
    const estados = await localizacaoService.listarEstados();
    res.json(estados);
  } catch (err) {
    next(err);
  }
}

module.exports = { listarEstados };
