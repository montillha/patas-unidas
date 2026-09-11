import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { Icon } from '../../components/common/Icon';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleSubmit(dados) {
    setCarregando(true);
    setErro(null);
    try {
      await login(dados);
      navigate('/');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__header">
          <div className="login__icon" aria-hidden="true">
            <Icon name="paw" size={24} />
          </div>
          <div>
            <h1 className="login__title">Entrar</h1>
            <p className="login__subtitle">Acesse sua conta de ONG ou de tutor</p>
          </div>
        </div>

        {erro && <p className="login__mensagem login__mensagem--erro">{erro}</p>}

        <LoginForm onSubmit={handleSubmit} onErro={setErro} carregando={carregando} />

        <div className="login__cadastro">
          <p>Ainda não tem conta?</p>
          <div className="login__cadastro-links">
            <Link to="/usuarios/cadastro">Cadastre-se como tutor</Link>
            <Link to="/ongs/cadastro">Cadastre-se como ONG</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
