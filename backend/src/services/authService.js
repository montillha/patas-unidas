const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { withTransaction } = require('../config/database');
const contaRepository = require('../repositories/contaRepository');
const ongRepository = require('../repositories/ongRepository');
const usuarioRepository = require('../repositories/usuarioRepository');
const ongService = require('./ongService');
const usuarioService = require('./usuarioService');
const { ErroDeConflito, ErroDeAutenticacao } = require('../utils/errors');

const SALT_ROUNDS = 10;
const CODIGO_EMAIL_DUPLICADO = '23505';
// Hash fixo usado quando a conta não existe, para o bcrypt.compare gastar um tempo equivalente
// ao de uma comparação real e não vazar, pelo tempo de resposta, se o e-mail existe ou não.
const HASH_DUMMY = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8T5.tGmZzKmyQpKqPX9y6yh8L6c8nW';

async function cadastrarOng(dados) {
  ongService.validarCamposObrigatorios(dados);
  const email = dados.email.trim().toLowerCase();
  const senha_hash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

  try {
    const { ong, conta } = await withTransaction(async (client) => {
      const conta = await contaRepository.criar({ email, senha_hash, tipo: 'ong' }, client);
      const ong = await ongRepository.criar(
        {
          conta_id: conta.id,
          nome: dados.nome.trim(),
          telefone: dados.telefone || null,
          endereco: dados.endereco.trim(),
          cidade: dados.cidade.trim(),
          estado: dados.estado.trim().toUpperCase(),
          descricao: dados.descricao || null,
        },
        client
      );
      return { ong, conta };
    });
    return { ...ong, email: conta.email };
  } catch (err) {
    if (err.code === CODIGO_EMAIL_DUPLICADO) {
      throw new ErroDeConflito('Já existe uma conta cadastrada com este e-mail.');
    }
    throw err;
  }
}

async function cadastrarUsuario(dados) {
  usuarioService.validarCampos(dados);
  const email = dados.email.trim().toLowerCase();
  const senha_hash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

  try {
    const { usuario, conta } = await withTransaction(async (client) => {
      const conta = await contaRepository.criar({ email, senha_hash, tipo: 'usuario' }, client);
      const usuario = await usuarioRepository.criar(
        {
          conta_id: conta.id,
          nome: dados.nome.trim(),
          telefone: dados.telefone || null,
          cidade: dados.cidade.trim(),
          estado: dados.estado.trim().toUpperCase(),
        },
        client
      );
      return { usuario, conta };
    });
    return { ...usuario, email: conta.email };
  } catch (err) {
    if (err.code === CODIGO_EMAIL_DUPLICADO) {
      throw new ErroDeConflito('Já existe uma conta cadastrada com este e-mail.');
    }
    throw err;
  }
}

async function buscarPerfilAtual(contaId, tipo) {
  return tipo === 'ong'
    ? ongRepository.buscarPorContaId(contaId)
    : usuarioRepository.buscarPorContaId(contaId);
}

async function login(email, senha) {
  const conta = await contaRepository.buscarPorEmail(email.trim().toLowerCase());
  const senhaOk = await bcrypt.compare(senha, conta ? conta.senha_hash : HASH_DUMMY);

  if (!conta || !senhaOk) {
    throw new ErroDeAutenticacao('E-mail ou senha inválidos.');
  }

  const perfil = await buscarPerfilAtual(conta.id, conta.tipo);
  const token = jwt.sign(
    { contaId: conta.id, tipo: conta.tipo, perfilId: perfil.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    token,
    conta: { id: conta.id, tipo: conta.tipo, email: conta.email },
    perfil,
  };
}

module.exports = { cadastrarOng, cadastrarUsuario, login, buscarPerfilAtual };
