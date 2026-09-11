import axios from 'axios';

// URL relativa: em produção front e back estão na mesma origem (mesmo container),
// em dev o proxy do vite.config.js redireciona para o backend local.
export const api = axios.create({ baseURL: '/api', withCredentials: true });
