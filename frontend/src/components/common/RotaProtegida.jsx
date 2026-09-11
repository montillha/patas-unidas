import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from './Loader';

export function RotaProtegida({ tipo, children }) {
  const { conta, carregando } = useAuth();

  if (carregando) return <Loader texto="Carregando..." />;
  if (!conta) return <Navigate to="/entrar" replace />;
  if (tipo && conta.tipo !== tipo) return <Navigate to="/" replace />;

  return children;
}
