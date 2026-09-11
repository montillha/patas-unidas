import { api } from './api';
import { ONGS_MOCK } from './ongsMock';

export const ongService = {
  criar: (dados) => api.post('/ongs', dados).then((r) => r.data),

  // Sem backend/banco conectado ainda, cai pro dado de exemplo em vez de mostrar erro —
  // remover o .catch() (e o ongsMock.js) quando o backend estiver de pé.
  listar: () =>
    api
      .get('/ongs')
      .then((r) => r.data)
      .catch(() => ONGS_MOCK),

  buscarPorId: (id) =>
    api
      .get(`/ongs/${id}`)
      .then((r) => r.data)
      .catch(() => {
        const ong = ONGS_MOCK.find((item) => String(item.id) === String(id));
        if (!ong) {
          const erro = new Error('ONG não encontrada.');
          erro.response = { status: 404 };
          throw erro;
        }
        return ong;
      }),
};
