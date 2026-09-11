// Dado de exemplo, mesmo formato do que a API retorna — usado só como fallback (ver
// ongService.js) enquanto não há backend/banco conectado, pra dar pra visualizar
// ListaOngs/DetalhesOng. Remover quando o backend estiver de pé.
export const ONGS_MOCK = [
  {
    id: 1,
    nome: 'Amigos de Quatro Patas',
    email: 'contato@amigosdequatropatas.org',
    telefone: '(16) 99999-0000',
    endereco: 'Rua das Flores, 123 - Centro',
    cidade: 'São Carlos',
    estado: 'SP',
    descricao:
      'Atuamos há 8 anos no resgate e cuidado de animais em situação de abandono na região de ' +
      'São Carlos. Todos os pets passam por avaliação veterinária antes de serem ' +
      'disponibilizados para adoção.',
    created_at: '2026-01-10T12:00:00.000Z',
  },
  {
    id: 2,
    nome: 'Patinhas do Bem',
    email: 'contato@patinhasdobem.org',
    telefone: '(16) 98888-1111',
    endereco: 'Avenida Presidente Vargas, 456 - Jardim América',
    cidade: 'Ribeirão Preto',
    estado: 'SP',
    descricao:
      'ONG voluntária dedicada ao resgate de cães e gatos em situação de rua, com foco em ' +
      'castração e reintegração responsável.',
    created_at: '2026-02-02T12:00:00.000Z',
  },
  {
    id: 3,
    nome: 'Refúgio Animal Araraquara',
    email: 'contato@refugioararaquara.org',
    telefone: '(16) 97777-2222',
    endereco: 'Rua Voluntários da Pátria, 789 - Vila Xavier',
    cidade: 'Araraquara',
    estado: 'SP',
    descricao: 'Abrigo temporário para animais resgatados enquanto aguardam adoção definitiva.',
    created_at: '2026-03-15T12:00:00.000Z',
  },
  {
    id: 4,
    nome: 'Lar Temporário Pet Feliz',
    email: 'contato@petfeliz.org',
    telefone: '(19) 96666-3333',
    endereco: 'Rua São José, 321 - Vila Recreio',
    cidade: 'Sertãozinho',
    estado: 'SP',
    descricao: 'Rede de lares temporários para pets resgatados na região de Sertãozinho.',
    created_at: '2026-04-20T12:00:00.000Z',
  },
  {
    id: 5,
    nome: 'Adote Rio Claro',
    email: 'contato@adoterioclaro.org',
    telefone: null,
    endereco: 'Avenida 11, 654 - Centro',
    cidade: 'Rio Claro',
    estado: 'SP',
    descricao: 'Grupo de protetores independentes que promove feirões de adoção mensais.',
    created_at: '2026-05-05T12:00:00.000Z',
  },
];
