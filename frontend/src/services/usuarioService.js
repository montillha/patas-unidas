import { api } from './api';

export const usuarioService = {
  criar: (dados) => api.post('/usuarios', dados).then((r) => r.data),
};
