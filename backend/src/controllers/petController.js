const petService = require('../services/petService');

async function listar(req, res, next) {
  try {
    const pets = await petService.listarPets({
      ongId: req.query.ong_id,
      status: req.query.status,
    });
    res.json(pets);
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const pet = await petService.buscarPetPorId(req.params.id);
    res.json(pet);
  } catch (err) {
    next(err);
  }
}

async function criar(req, res, next) {
  try {
    const pet = await petService.criarPet(req.body, req.conta.perfilId, req.files);
    res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const pet = await petService.atualizarPet(req.params.id, req.body, req.conta.perfilId, req.files);
    res.json(pet);
  } catch (err) {
    next(err);
  }
}

async function alterarStatus(req, res, next) {
  try {
    const pet = await petService.alterarStatus(req.params.id, req.body?.status, req.conta.perfilId);
    res.json(pet);
  } catch (err) {
    next(err);
  }
}

async function excluir(req, res, next) {
  try {
    await petService.excluirPet(req.params.id, req.conta.perfilId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function foto(req, res, next) {
  try {
    const arquivo = await petService.buscarFoto(req.params.id, req.params.fotoId);
    res.set({
      'Content-Type': arquivo.mime_type,
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    });
    res.send(arquivo.dados);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, alterarStatus, excluir, foto };
