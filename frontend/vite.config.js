import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Em dev, o front roda em uma porta (ex: 5173) e o back em outra (ex: 3000).
// O proxy abaixo faz `/api` do front apontar pro back local, sem precisar
// reescrever nada quando for pra produção (onde os dois já ficam na mesma origem).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
