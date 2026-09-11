const ongService = require('../services/ongService');
const authService = require('../services/authService');

async function criar(req, res, next) {
  try {
    const ong = await authService.cadastrarOng(req.body);
    res.status(201).json(ong);
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const ongs = await ongService.listarOngs();
    res.json(ongs);
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const ong = await ongService.buscarOngPorId(req.params.id);
    res.json(ong);
  } catch (err) {
    next(err);
  }
}

module.exports = { criar, listar, buscarPorId };
