const ongRepository = require('../repositories/ongRepository');
const { validarEmail, validarSenha } = require('../utils/validadores');
const { ErroDeValidacao } = require('../utils/errors');

function validarCamposObrigatorios(dados) {
  const { nome, email, senha, endereco, cidade, estado } = dados;

  if (!nome || nome.trim().length < 3) {
    throw new ErroDeValidacao('Nome deve ter ao menos 3 caracteres.');
  }
  validarEmail(email);
  validarSenha(senha);
  if (!endereco || !endereco.trim()) throw new ErroDeValidacao('Endereço é obrigatório.');
  if (!cidade || !cidade.trim()) throw new ErroDeValidacao('Cidade é obrigatória.');
  if (!estado || estado.trim().length !== 2) {
    throw new ErroDeValidacao('Estado deve ser a sigla com 2 letras.');
  }
}

async function listarOngs() {
  return ongRepository.listar();
}

async function buscarOngPorId(id) {
  const ong = await ongRepository.buscarPorId(id);
  if (!ong) {
    const erro = new Error('ONG não encontrada.');
    erro.status = 404;
    throw erro;
  }
  return ong;
}

module.exports = { validarCamposObrigatorios, listarOngs, buscarOngPorId };
