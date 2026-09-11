import { z } from 'zod';

export const ongSchema = z.object({
  nome: z.string().trim().min(3, 'Nome deve ter ao menos 3 caracteres.'),
  email: z.string().trim().email('E-mail inválido.'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.'),
  telefone: z.string().optional(),
  endereco: z.string().trim().min(1, 'Endereço é obrigatório.'),
  cidade: z.string().trim().min(1, 'Cidade é obrigatória.'),
  estado: z.string().trim().length(2, 'Estado deve ser a sigla com 2 letras.'),
  descricao: z.string().optional(),
});
