import { api } from './api';

export const ongService = {
  criar: (dados) => api.post('/ongs', dados).then((r) => r.data),
  listar: () => api.get('/ongs').then((r) => r.data),
  buscarPorId: (id) => api.get(`/ongs/${id}`).then((r) => r.data),
  atualizar: (id, dados) => api.put(`/ongs/${id}`, dados).then((r) => r.data),
};
