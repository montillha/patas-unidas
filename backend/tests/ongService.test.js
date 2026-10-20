const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const dbPath = require.resolve('../src/config/database');
require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: { pool: {}, withTransaction: async (callback) => callback({}) },
};

const ongRepository = require('../src/repositories/ongRepository');
const ongService = require('../src/services/ongService');

const ongExistente = { id: 7, nome: 'Amigos', cidade: 'Recife', estado: 'PE' };
const dadosValidos = {
  nome: '  Patas do Bem ',
  telefone: ' ',
  endereco: 'Rua A, 10',
  cidade: 'Olinda',
  estado: 'pe',
  descricao: '',
};

describe('ongService.atualizarOng', () => {
  let atualizado;

  beforeEach(() => {
    atualizado = null;
    ongRepository.buscarPorId = async (id) => (id === 7 ? ongExistente : undefined);
    ongRepository.atualizar = async (id, campos) => {
      atualizado = { id, campos };
    };
  });

  test('normaliza os campos e salva', async () => {
    await ongService.atualizarOng('7', dadosValidos, 7);
    assert.deepEqual(atualizado, {
      id: 7,
      campos: {
        nome: 'Patas do Bem',
        telefone: null,
        endereco: 'Rua A, 10',
        cidade: 'Olinda',
        estado: 'PE',
        descricao: null,
      },
    });
  });

  test('recusa quando a ONG logada não é a dona', async () => {
    await assert.rejects(ongService.atualizarOng('7', dadosValidos, 8), { status: 403 });
    assert.equal(atualizado, null);
  });

  test('retorna 404 para ONG inexistente ou id inválido', async () => {
    await assert.rejects(ongService.atualizarOng('99', dadosValidos, 99), { status: 404 });
    await assert.rejects(ongService.atualizarOng('abc', dadosValidos, 7), { status: 404 });
  });

  test('valida os campos obrigatórios', async () => {
    await assert.rejects(ongService.atualizarOng('7', { ...dadosValidos, nome: 'ab' }, 7), { status: 400 });
    await assert.rejects(ongService.atualizarOng('7', { ...dadosValidos, estado: 'PER' }, 7), { status: 400 });
    assert.equal(atualizado, null);
  });
});
