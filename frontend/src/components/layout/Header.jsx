import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { conta, perfil, logout } = useAuth();
  const naPaginaDeEntrar = pathname === '/entrar';
  const naPaginaDeCadastro = pathname === '/usuarios/cadastro' || pathname === '/ongs/cadastro';

  async function handleSair() {
    await logout();
    navigate('/');
  }

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <span className="header__logo-mark" aria-hidden="true">
          <Icon name="paw" size={16} />
        </span>
        Patas Unidas
      </Link>
      <nav className="header__nav">
        <div className="header__links">
          <span className="header__link header__link--em-breve" title="Em breve">
            Pets
          </span>
          <Link to="/ongs" className="header__link">
            ONGs
          </Link>
        </div>
        <div className="header__actions">
          {conta ? (
            <>
              <span className="header__link">Olá, {perfil?.nome}</span>
              <button type="button" className="header__link header__link--botao" onClick={handleSair}>
                Sair
              </button>
            </>
          ) : (
            <>
              {!naPaginaDeEntrar && (
                <Link to="/entrar">
                  <Button variant="outline-primary">Entrar</Button>
                </Link>
              )}
              {!naPaginaDeCadastro && (
                <Link to="/usuarios/cadastro">
                  <Button variant="accent">Cadastrar</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
