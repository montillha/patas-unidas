import { api } from './api';

// Fotos vão junto dos campos em multipart/form-data. `fotos.novas` são Files; `fotos.remover`
// são ids de fotos já salvas que devem sair do pet (só usado na edição).
function montarFormData(dados, { novas = [], remover = [] } = {}) {
  const form = new FormData();
  Object.entries(dados).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null) form.append(chave, String(valor));
  });
  novas.forEach((arquivo) => form.append('fotos', arquivo));
  remover.forEach((id) => form.append('remover_fotos', String(id)));
  return form;
}

export const petService = {
  listar: ({ ongId, status } = {}) =>
    api.get('/pets', { params: { ong_id: ongId, status } }).then((r) => r.data),

  buscarPorId: (id) => api.get(`/pets/${id}`).then((r) => r.data),

  criar: (dados, fotos) => api.post('/pets', montarFormData(dados, fotos)).then((r) => r.data),

  atualizar: (id, dados, fotos) =>
    api.put(`/pets/${id}`, montarFormData(dados, fotos)).then((r) => r.data),

  alterarStatus: (id, status) => api.patch(`/pets/${id}/status`, { status }).then((r) => r.data),

  excluir: (id) => api.delete(`/pets/${id}`),
};
