const { withTransaction } = require('../config/database');
const petRepository = require('../repositories/petRepository');
const petFotoRepository = require('../repositories/petFotoRepository');
const { ESPECIES, PORTES, STATUS, MAX_FOTOS } = require('../models/Pet');
const { detectarMime } = require('../utils/imagem');
const { ErroDeValidacao, ErroDeAutorizacao, ErroNaoEncontrado } = require('../utils/errors');

const POSICOES_FOTO = [0, 1];
const NOME_MIN = 2;
const NOME_MAX = 100;
const RACA_MAX = 100;
const DESCRICAO_MAX = 1000;
const IDADE_MAX = 40;

// Multipart envia tudo como string; JSON puro pode mandar boolean de verdade.
function paraBoolean(valor) {
  return valor === true || valor === 'true' || valor === 'on' || valor === '1' || valor === 1;
}

function textoOpcional(valor) {
  const texto = typeof valor === 'string' ? valor.trim() : '';
  return texto || null;
}

function paraIdadeInteira(valor) {
  if (valor === undefined || valor === null || String(valor).trim() === '') return NaN;
  return Number(valor);
}

function validarCampos(dados = {}) {
  const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
  if (nome.length < NOME_MIN) {
    throw new ErroDeValidacao(`Nome deve ter ao menos ${NOME_MIN} caracteres.`);
  }
  if (nome.length > NOME_MAX) {
    throw new ErroDeValidacao(`Nome deve ter no máximo ${NOME_MAX} caracteres.`);
  }

  if (!ESPECIES.includes(dados.especie)) {
    throw new ErroDeValidacao('Espécie deve ser gato ou cachorro.');
  }
  if (!PORTES.includes(dados.porte)) {
    throw new ErroDeValidacao('Porte deve ser pequeno, médio ou grande.');
  }

  const idade = paraIdadeInteira(dados.idade_anos);
  if (!Number.isInteger(idade) || idade < 0 || idade > IDADE_MAX) {
    throw new ErroDeValidacao(`Idade deve ser um número inteiro entre 0 e ${IDADE_MAX}.`);
  }

  const raca = textoOpcional(dados.raca);
  if (raca && raca.length > RACA_MAX) {
    throw new ErroDeValidacao(`Raça deve ter no máximo ${RACA_MAX} caracteres.`);
  }

  const descricao = textoOpcional(dados.descricao);
  if (descricao && descricao.length > DESCRICAO_MAX) {
    throw new ErroDeValidacao(`Descrição deve ter no máximo ${DESCRICAO_MAX} caracteres.`);
  }

  return {
    nome,
    especie: dados.especie,
    porte: dados.porte,
    idade_anos: idade,
    raca,
    descricao,
    vacinado: paraBoolean(dados.vacinado),
    castrado: paraBoolean(dados.castrado),
  };
}

function validarId(valor) {
  if (!/^\d+$/.test(String(valor))) throw new ErroNaoEncontrado('Pet não encontrado.');
  return Number(valor);
}

function validarArquivos(arquivos = []) {
  if (arquivos.length > MAX_FOTOS) {
    throw new ErroDeValidacao(`Envie no máximo ${MAX_FOTOS} fotos.`);
  }
  return arquivos.map((arquivo) => {
    const mime_type = detectarMime(arquivo.buffer);
    if (!mime_type) throw new ErroDeValidacao('As fotos devem ser JPG, PNG ou WebP.');
    return { mime_type, dados: arquivo.buffer };
  });
}

function normalizarIdsParaRemover(valor) {
  if (valor === undefined || valor === null || valor === '') return [];
  const lista = Array.isArray(valor) ? valor : [valor];
  return lista.map((item) => {
    if (!/^\d+$/.test(String(item))) throw new ErroDeValidacao('Foto a remover inválida.');
    return Number(item);
  });
}

function montarPet(pet) {
  const { fotos_ids, ...resto } = pet;
  return {
    ...resto,
    fotos: fotos_ids.map((fotoId) => ({ id: fotoId, url: `/api/pets/${pet.id}/fotos/${fotoId}` })),
  };
}

async function carregarPet(id) {
  const pet = await petRepository.buscarPorId(validarId(id));
  if (!pet) throw new ErroNaoEncontrado('Pet não encontrado.');
  return pet;
}

function garantirDono(pet, ongId) {
  if (!ongId || pet.ong_id !== Number(ongId)) {
    throw new ErroDeAutorizacao('Você não tem permissão para alterar este pet.');
  }
}

async function listarPets({ ongId, status } = {}) {
  if (ongId !== undefined && !/^\d+$/.test(String(ongId))) {
    throw new ErroDeValidacao('ong_id inválido.');
  }
  if (status !== undefined && !STATUS.includes(status)) {
    throw new ErroDeValidacao('Status deve ser disponivel ou adotado.');
  }
  const pets = await petRepository.listar({
    ongId: ongId !== undefined ? Number(ongId) : undefined,
    status,
  });
  return pets.map(montarPet);
}

async function buscarPetPorId(id) {
  return montarPet(await carregarPet(id));
}

async function criarPet(dados, ongId, arquivos = []) {
  if (!ongId) throw new ErroDeAutorizacao('Apenas ONGs podem cadastrar pets.');

  const campos = validarCampos(dados);
  const fotos = validarArquivos(arquivos);

  const id = await withTransaction(async (client) => {
    const criado = await petRepository.criar({ ong_id: Number(ongId), ...campos }, client);
    for (const [indice, foto] of fotos.entries()) {
      await petFotoRepository.inserir({ pet_id: criado.id, posicao: indice, ...foto }, client);
    }
    return criado.id;
  });

  return buscarPetPorId(id);
}

async function atualizarPet(id, dados, ongId, arquivos = []) {
  const pet = await carregarPet(id);
  garantirDono(pet, ongId);

  const campos = validarCampos(dados);
  const novas = validarArquivos(arquivos);
  const idsParaRemover = normalizarIdsParaRemover(dados?.remover_fotos);

  await withTransaction(async (client) => {
    const existentes = await petFotoRepository.listarPorPet(pet.id, client);
    const idsExistentes = existentes.map((foto) => foto.id);

    if (idsParaRemover.some((fotoId) => !idsExistentes.includes(fotoId))) {
      throw new ErroDeValidacao('Foto a remover não pertence a este pet.');
    }

    const restantes = existentes.filter((foto) => !idsParaRemover.includes(foto.id));
    if (restantes.length + novas.length > MAX_FOTOS) {
      throw new ErroDeValidacao(`Cada pet pode ter no máximo ${MAX_FOTOS} fotos.`);
    }

    await petRepository.atualizar(pet.id, campos, client);
    await petFotoRepository.removerPorIds(idsParaRemover, pet.id, client);

    const ocupadas = restantes.map((foto) => foto.posicao);
    const livres = POSICOES_FOTO.filter((posicao) => !ocupadas.includes(posicao));
    for (const [indice, foto] of novas.entries()) {
      await petFotoRepository.inserir({ pet_id: pet.id, posicao: livres[indice], ...foto }, client);
    }
  });

  return buscarPetPorId(pet.id);
}

async function alterarStatus(id, status, ongId) {
  const pet = await carregarPet(id);
  garantirDono(pet, ongId);

  if (!STATUS.includes(status)) {
    throw new ErroDeValidacao('Status deve ser disponivel ou adotado.');
  }

  await petRepository.atualizarStatus(pet.id, status);
  return buscarPetPorId(pet.id);
}

async function excluirPet(id, ongId) {
  const pet = await carregarPet(id);
  garantirDono(pet, ongId);
  await petRepository.excluir(pet.id);
}

async function buscarFoto(petId, fotoId) {
  if (!/^\d+$/.test(String(petId)) || !/^\d+$/.test(String(fotoId))) {
    throw new ErroNaoEncontrado('Foto não encontrada.');
  }
  const foto = await petFotoRepository.buscarPorId(Number(fotoId), Number(petId));
  if (!foto) throw new ErroNaoEncontrado('Foto não encontrada.');
  return foto;
}

module.exports = {
  validarCampos,
  listarPets,
  buscarPetPorId,
  criarPet,
  atualizarPet,
  alterarStatus,
  excluirPet,
  buscarFoto,
};
