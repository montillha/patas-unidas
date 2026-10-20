import { z } from 'zod';
import { ESPECIES, PORTES } from '../utils/petLabels';

const IDADE_MAX = 40;

// Só formato e obrigatoriedade — a regra de verdade (inclusive faixa de idade e tamanho da
// descrição) é validada de novo no backend (services/petService.js).
export const petSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'Nome deve ter ao menos 2 caracteres.')
    .max(100, 'Nome deve ter no máximo 100 caracteres.'),
  especie: z.enum(
    ESPECIES.map((e) => e.valor),
    { errorMap: () => ({ message: 'Selecione a espécie.' }) }
  ),
  porte: z.enum(
    PORTES.map((p) => p.valor),
    { errorMap: () => ({ message: 'Selecione o porte.' }) }
  ),
  // Fica como string (vem de <input>): z.coerce.number() transformaria '' em 0.
  idade_anos: z
    .string()
    .trim()
    .min(1, 'Idade é obrigatória.')
    .regex(/^\d+$/, 'Idade deve ser um número inteiro.')
    .refine((valor) => Number(valor) <= IDADE_MAX, `Idade deve ser no máximo ${IDADE_MAX} anos.`),
  raca: z.string().trim().max(100, 'Raça deve ter no máximo 100 caracteres.').optional(),
  descricao: z.string().trim().max(1000, 'Descrição deve ter no máximo 1000 caracteres.').optional(),
  vacinado: z.boolean().optional(),
  castrado: z.boolean().optional(),
});
