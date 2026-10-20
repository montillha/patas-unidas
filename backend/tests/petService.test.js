const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// withTransaction real exige Postgres; aqui só repassa um "client" falso para o callback.
const dbPath = require.resolve('../src/config/database');
require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: { pool: {}, withTransaction: async (callback) => callback({}) },
};

const petRepository = require('../src/repositories/petRepository');
const petFotoRepository = require('../src/repositories/petFotoRepository');
const petService = require('../src/services/petService');
const { detectarMime } = require('../src/utils/imagem');

const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const TEXTO = Buffer.from('isto nao e uma imagem de verdade');

const dadosValidos = {
  nome: 'Mel',
  especie: 'gato',
  porte: 'pequeno',
  idade_anos: '1',
  raca: 'SRD',
  descricao: 'Dócil e brincalhona.',
  vacinado: 'true',
  castrado: 'false',
};

function petDoBanco(sobrescrever = {}) {
  return {
    id: 10,
    ong_id: 1,
    nome: 'Mel',
    especie: 'gato',
    porte: 'pequeno',
    idade_anos: 1,
    status: 'disponivel',
    fotos_ids: [],
    ...sobrescrever,
  };
}

let chamadas;

beforeEach(() => {
  chamadas = { criar: 0, atualizar: 0, excluir: 0, status: 0, fotosInseridas: [], fotosRemovidas: [] };
  petRepository.criar = async () => {
    chamadas.criar += 1;
    return { id: 10 };
  };
  petRepository.atualizar = async () => {
    chamadas.atualizar += 1;
  };
  petRepository.atualizarStatus = async () => {
    chamadas.status += 1;
  };
  petRepository.excluir = async () => {
    chamadas.excluir += 1;
  };
  petRepository.buscarPorId = async (id) => (id === 10 ? petDoBanco() : undefined);
  petRepository.listar = async () => [petDoBanco({ fotos_ids: [5] })];
  petFotoRepository.listarPorPet = async () => [];
  petFotoRepository.inserir = async (foto) => {
    chamadas.fotosInseridas.push(foto);
  };
  petFotoRepository.removerPorIds = async (ids) => {
    chamadas.fotosRemovidas.push(...ids);
  };
});

describe('validarCampos', () => {
  test('aceita dados válidos e normaliza tipos', () => {
    const campos = petService.validarCampos(dadosValidos);
    assert.equal(campos.idade_anos, 1);
    assert.equal(campos.vacinado, true);
    assert.equal(campos.castrado, false);
  });

  test('raça e descrição vazias viram null', () => {
    const campos = petService.validarCampos({ ...dadosValidos, raca: '  ', descricao: '' });
    assert.equal(campos.raca, null);
    assert.equal(campos.descricao, null);
  });

  const invalidos = [
    ['nome curto', { nome: 'A' }],
    ['nome ausente', { nome: undefined }],
    ['espécie inválida', { especie: 'coelho' }],
    ['porte inválido', { porte: 'gigante' }],
    ['idade negativa', { idade_anos: '-1' }],
    ['idade não inteira', { idade_anos: '1.5' }],
    ['idade acima do limite', { idade_anos: '41' }],
    ['idade vazia', { idade_anos: '' }],
    ['descrição longa demais', { descricao: 'x'.repeat(1001) }],
  ];

  for (const [descricao, alteracao] of invalidos) {
    test(`rejeita ${descricao}`, () => {
      assert.throws(
        () => petService.validarCampos({ ...dadosValidos, ...alteracao }),
        { name: 'ErroDeValidacao' }
      );
    });
  }
});

describe('criarPet', () => {
  test('rejeita quando não há ONG no token', async () => {
    await assert.rejects(petService.criarPet(dadosValidos, undefined), {
      name: 'ErroDeAutorizacao',
    });
    assert.equal(chamadas.criar, 0);
  });

  test('cria o pet e grava as fotos nas posições 0 e 1', async () => {
    const pet = await petService.criarPet(dadosValidos, 1, [{ buffer: JPEG }, { buffer: PNG }]);
    assert.equal(chamadas.criar, 1);
    assert.deepEqual(
      chamadas.fotosInseridas.map((f) => [f.posicao, f.mime_type]),
      [[0, 'image/jpeg'], [1, 'image/png']]
    );
    assert.equal(pet.id, 10);
  });

  test('rejeita arquivo que não é imagem (mesmo com mimetype forjado)', async () => {
    await assert.rejects(
      petService.criarPet(dadosValidos, 1, [{ buffer: TEXTO, mimetype: 'image/jpeg' }]),
      { name: 'ErroDeValidacao' }
    );
    assert.equal(chamadas.criar, 0);
  });

  test('rejeita mais de 2 fotos', async () => {
    const tres = [{ buffer: JPEG }, { buffer: JPEG }, { buffer: JPEG }];
    await assert.rejects(petService.criarPet(dadosValidos, 1, tres), { name: 'ErroDeValidacao' });
  });
});

describe('atualizarPet', () => {
  test('404 para pet inexistente', async () => {
    await assert.rejects(petService.atualizarPet('999', dadosValidos, 1), {
      name: 'ErroNaoEncontrado',
    });
  });

  test('404 para id não numérico (sem estourar erro de SQL)', async () => {
    await assert.rejects(petService.atualizarPet('abc', dadosValidos, 1), {
      name: 'ErroNaoEncontrado',
    });
  });

  test('403 quando a ONG não é dona do pet', async () => {
    await assert.rejects(petService.atualizarPet('10', dadosValidos, 2), {
      name: 'ErroDeAutorizacao',
    });
    assert.equal(chamadas.atualizar, 0);
  });

  test('ocupa a posição livre ao adicionar foto com uma já existente', async () => {
    petFotoRepository.listarPorPet = async () => [{ id: 7, posicao: 0 }];
    await petService.atualizarPet('10', dadosValidos, 1, [{ buffer: PNG }]);
    assert.deepEqual(chamadas.fotosInseridas.map((f) => f.posicao), [1]);
  });

  test('libera a posição ao remover uma foto e reaproveita na nova', async () => {
    petFotoRepository.listarPorPet = async () => [
      { id: 7, posicao: 0 },
      { id: 8, posicao: 1 },
    ];
    await petService.atualizarPet('10', { ...dadosValidos, remover_fotos: '7' }, 1, [{ buffer: JPEG }]);
    assert.deepEqual(chamadas.fotosRemovidas, [7]);
    assert.deepEqual(chamadas.fotosInseridas.map((f) => f.posicao), [0]);
  });

  test('rejeita passar de 2 fotos no total', async () => {
    petFotoRepository.listarPorPet = async () => [
      { id: 7, posicao: 0 },
      { id: 8, posicao: 1 },
    ];
    await assert.rejects(petService.atualizarPet('10', dadosValidos, 1, [{ buffer: JPEG }]), {
      name: 'ErroDeValidacao',
    });
  });

  test('rejeita remover foto que não pertence ao pet', async () => {
    petFotoRepository.listarPorPet = async () => [{ id: 7, posicao: 0 }];
    await assert.rejects(
      petService.atualizarPet('10', { ...dadosValidos, remover_fotos: ['99'] }, 1),
      { name: 'ErroDeValidacao' }
    );
  });
});

describe('alterarStatus', () => {
  test('marca como adotado quando é o dono', async () => {
    await petService.alterarStatus('10', 'adotado', 1);
    assert.equal(chamadas.status, 1);
  });

  test('rejeita status inválido', async () => {
    await assert.rejects(petService.alterarStatus('10', 'sumido', 1), { name: 'ErroDeValidacao' });
  });

  test('403 para ONG que não é dona', async () => {
    await assert.rejects(petService.alterarStatus('10', 'adotado', 2), {
      name: 'ErroDeAutorizacao',
    });
    assert.equal(chamadas.status, 0);
  });
});

describe('excluirPet', () => {
  test('exclui quando é o dono', async () => {
    await petService.excluirPet('10', 1);
    assert.equal(chamadas.excluir, 1);
  });

  test('403 para ONG que não é dona', async () => {
    await assert.rejects(petService.excluirPet('10', 2), { name: 'ErroDeAutorizacao' });
    assert.equal(chamadas.excluir, 0);
  });
});

describe('listarPets / buscarPetPorId', () => {
  test('monta as urls das fotos e não vaza fotos_ids', async () => {
    const [pet] = await petService.listarPets();
    assert.deepEqual(pet.fotos, [{ id: 5, url: '/api/pets/10/fotos/5' }]);
    assert.equal('fotos_ids' in pet, false);
  });

  test('rejeita filtros inválidos', async () => {
    await assert.rejects(petService.listarPets({ status: 'x' }), { name: 'ErroDeValidacao' });
    await assert.rejects(petService.listarPets({ ongId: 'abc' }), { name: 'ErroDeValidacao' });
  });

  test('404 para pet inexistente', async () => {
    await assert.rejects(petService.buscarPetPorId('999'), { name: 'ErroNaoEncontrado' });
  });
});

describe('detectarMime', () => {
  test('reconhece jpeg, png e rejeita o resto', () => {
    assert.equal(detectarMime(JPEG), 'image/jpeg');
    assert.equal(detectarMime(PNG), 'image/png');
    assert.equal(detectarMime(TEXTO), null);
    assert.equal(detectarMime(Buffer.alloc(0)), null);
  });
});
