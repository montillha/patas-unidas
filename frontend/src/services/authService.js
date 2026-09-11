import { api } from './api';

export const authService = {
  login: (dados) => api.post('/auth/login', dados).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};
