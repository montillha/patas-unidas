import { describe, expect, test } from 'vitest';
import { formatarIdade, rotuloEspecie, rotuloPorte } from './petLabels';

describe('petLabels', () => {
  test('formatarIdade trata 0, 1 e plural', () => {
    expect(formatarIdade(0)).toBe('menos de 1 ano');
    expect(formatarIdade(1)).toBe('1 ano');
    expect(formatarIdade(3)).toBe('3 anos');
  });

  test('rótulos de espécie e porte', () => {
    expect(rotuloEspecie('cachorro')).toBe('cão');
    expect(rotuloEspecie('gato')).toBe('gato');
    expect(rotuloPorte('medio')).toBe('médio porte');
  });
});
