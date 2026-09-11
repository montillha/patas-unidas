import { api } from './api';

export const localizacaoService = {
  listarEstados: () => api.get('/estados').then((r) => r.data),
};
