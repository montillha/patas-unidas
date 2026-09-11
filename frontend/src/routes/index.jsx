import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CadastroOng from '../pages/CadastroOng';
import ListaOngs from '../pages/ListaOngs';
import DetalhesOng from '../pages/DetalhesOng';
import Login from '../pages/Login';
import CadastroUsuario from '../pages/CadastroUsuario';
import Pets from '../pages/Pets';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/pets" element={<Pets />} />
      <Route path="/usuarios/cadastro" element={<CadastroUsuario />} />
      <Route path="/ongs/cadastro" element={<CadastroOng />} />
      <Route path="/ongs/:id" element={<DetalhesOng />} />
      <Route path="/ongs" element={<ListaOngs />} />
    </Routes>
  );
}
