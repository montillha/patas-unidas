// Rótulos de exibição dos valores de enum de pet. Os valores (`valor`) são os mesmos
// aceitos pelo backend; só os rótulos são decisão de UI.
export const ESPECIES = [
  { valor: 'gato', label: 'Gato' },
  { valor: 'cachorro', label: 'Cachorro' },
];

export const PORTES = [
  { valor: 'pequeno', label: 'Pequeno' },
  { valor: 'medio', label: 'Médio' },
  { valor: 'grande', label: 'Grande' },
];

const ESPECIE_CURTA = { gato: 'gato', cachorro: 'cão' };
const PORTE_LABEL = { pequeno: 'pequeno porte', medio: 'médio porte', grande: 'grande porte' };

export const MAX_FOTOS = 2;
export const TAMANHO_MAX_FOTO_MB = 2;
export const TIPOS_FOTO_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];

export function rotuloEspecie(especie) {
  return ESPECIE_CURTA[especie] ?? especie;
}

export function rotuloPorte(porte) {
  return PORTE_LABEL[porte] ?? porte;
}

export function formatarIdade(anos) {
  if (anos === 0) return 'menos de 1 ano';
  return anos === 1 ? '1 ano' : `${anos} anos`;
}
