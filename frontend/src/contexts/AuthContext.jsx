import { createContext, useCallback, useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [conta, setConta] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    authService
      .me()
      .then((dados) => {
        setConta(dados.conta);
        setPerfil(dados.perfil);
      })
      .catch(() => {
        setConta(null);
        setPerfil(null);
      })
      .finally(() => setCarregando(false));
  }, []);

  const login = useCallback(async (dados) => {
    const resposta = await authService.login(dados);
    setConta(resposta.conta);
    setPerfil(resposta.perfil);
    return resposta;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setConta(null);
    setPerfil(null);
  }, []);

  return (
    <AuthContext.Provider value={{ conta, perfil, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
