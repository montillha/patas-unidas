const ongRepository = require('../repositories/ongRepository');
const { validarEmail, validarSenha } = require('../utils/validadores');
const { ErroDeValidacao, ErroDeAutorizacao, ErroNaoEncontrado } = require('../utils/errors');

function validarCamposDoPerfil({ nome, endereco, cidade, estado }) {
  if (!nome || nome.trim().length < 3) {
    throw new ErroDeValidacao('Nome deve ter ao menos 3 caracteres.');
  }
  if (!endereco || !endereco.trim()) throw new ErroDeValidacao('Endereço é obrigatório.');
  if (!cidade || !cidade.trim()) throw new ErroDeValidacao('Cidade é obrigatória.');
  if (!estado || estado.trim().length !== 2) {
    throw new ErroDeValidacao('Estado deve ser a sigla com 2 letras.');
  }
}

function validarCamposObrigatorios(dados) {
  validarCamposDoPerfil(dados);
  validarEmail(dados.email);
  validarSenha(dados.senha);
}

function validarId(valor) {
  if (!/^\d+$/.test(String(valor))) throw new ErroNaoEncontrado('ONG não encontrada.');
  return Number(valor);
}

async function listarOngs() {
  return ongRepository.listar();
}

async function buscarOngPorId(id) {
  const ong = await ongRepository.buscarPorId(validarId(id));
  if (!ong) throw new ErroNaoEncontrado('ONG não encontrada.');
  return ong;
}

// E-mail e senha pertencem à conta e não mudam por aqui.
async function atualizarOng(id, dados = {}, ongId) {
  const ong = await buscarOngPorId(id);
  if (!ongId || ong.id !== Number(ongId)) {
    throw new ErroDeAutorizacao('Você não tem permissão para alterar esta ONG.');
  }

  validarCamposDoPerfil(dados);
  await ongRepository.atualizar(ong.id, {
    nome: dados.nome.trim(),
    telefone: typeof dados.telefone === 'string' ? dados.telefone.trim() || null : null,
    endereco: dados.endereco.trim(),
    cidade: dados.cidade.trim(),
    estado: dados.estado.trim().toUpperCase(),
    descricao: typeof dados.descricao === 'string' ? dados.descricao.trim() || null : null,
  });

  return buscarOngPorId(ong.id);
}

module.exports = { validarCamposObrigatorios, listarOngs, buscarOngPorId, atualizarOng };
