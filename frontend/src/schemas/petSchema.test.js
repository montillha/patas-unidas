import { describe, expect, test } from 'vitest';
import { petSchema } from './petSchema';

const valido = {
  nome: 'Mel',
  especie: 'gato',
  porte: 'pequeno',
  idade_anos: '1',
  raca: 'SRD',
  descricao: 'Dócil.',
  vacinado: true,
  castrado: false,
};

function mensagemDoCampo(dados, campo) {
  const resultado = petSchema.safeParse(dados);
  if (resultado.success) return null;
  return resultado.error.issues.find((issue) => issue.path[0] === campo)?.message ?? null;
}

describe('petSchema', () => {
  test('aceita um pet válido', () => {
    expect(petSchema.safeParse(valido).success).toBe(true);
  });

  test('raça, descrição e checkboxes são opcionais', () => {
    const { raca, descricao, vacinado, castrado, ...minimo } = valido;
    expect(petSchema.safeParse(minimo).success).toBe(true);
  });

  test('nome curto', () => {
    expect(mensagemDoCampo({ ...valido, nome: 'A' }, 'nome')).toBe(
      'Nome deve ter ao menos 2 caracteres.'
    );
  });

  test('espécie não selecionada', () => {
    expect(mensagemDoCampo({ ...valido, especie: undefined }, 'especie')).toBe('Selecione a espécie.');
    expect(mensagemDoCampo({ ...valido, especie: 'coelho' }, 'especie')).toBe('Selecione a espécie.');
  });

  test('porte não selecionado', () => {
    expect(mensagemDoCampo({ ...valido, porte: '' }, 'porte')).toBe('Selecione o porte.');
  });

  test('idade vazia não vira 0', () => {
    expect(mensagemDoCampo({ ...valido, idade_anos: '' }, 'idade_anos')).toBe('Idade é obrigatória.');
  });

  test('idade não inteira ou negativa', () => {
    expect(mensagemDoCampo({ ...valido, idade_anos: '1.5' }, 'idade_anos')).toBe(
      'Idade deve ser um número inteiro.'
    );
    expect(mensagemDoCampo({ ...valido, idade_anos: '-2' }, 'idade_anos')).toBe(
      'Idade deve ser um número inteiro.'
    );
  });

  test('idade acima de 40', () => {
    expect(mensagemDoCampo({ ...valido, idade_anos: '41' }, 'idade_anos')).toBe(
      'Idade deve ser no máximo 40 anos.'
    );
  });

  test('idade 0 é válida (filhote)', () => {
    expect(petSchema.safeParse({ ...valido, idade_anos: '0' }).success).toBe(true);
  });

  test('descrição longa demais', () => {
    expect(mensagemDoCampo({ ...valido, descricao: 'x'.repeat(1001) }, 'descricao')).toBe(
      'Descrição deve ter no máximo 1000 caracteres.'
    );
  });
});
