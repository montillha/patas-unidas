const URL_IBGE = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome';

// Rede de segurança caso o IBGE esteja fora do ar — lista de referência que não muda.
const ESTADOS_FALLBACK = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

let cacheEstados = null;

async function listarEstados() {
  if (cacheEstados) return cacheEstados;

  try {
    const resposta = await fetch(URL_IBGE);
    if (!resposta.ok) throw new Error(`IBGE respondeu ${resposta.status}`);

    const dados = await resposta.json();
    cacheEstados = dados.map((estado) => ({ sigla: estado.sigla, nome: estado.nome }));
  } catch (err) {
    console.error('Falha ao buscar estados no IBGE, usando lista de referência local:', err.message);
    cacheEstados = ESTADOS_FALLBACK;
  }

  return cacheEstados;
}

module.exports = { listarEstados };
