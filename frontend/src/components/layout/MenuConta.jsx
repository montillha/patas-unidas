import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuConta.css';

// Avatar redondo com a inicial do nome; abre um menu com os atalhos da conta logada.
export function MenuConta({ conta, perfil, onSair }) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef(null);
  const ehOng = conta.tipo === 'ong';
  const nome = perfil?.nome ?? '';
  const inicial = nome.trim().charAt(0).toUpperCase() || '?';

  useEffect(() => {
    if (!aberto) return undefined;
    function fecharAoClicarFora(evento) {
      if (!raiz.current?.contains(evento.target)) setAberto(false);
    }
    function fecharComEsc(evento) {
      if (evento.key === 'Escape') setAberto(false);
    }
    document.addEventListener('mousedown', fecharAoClicarFora);
    document.addEventListener('keydown', fecharComEsc);
    return () => {
      document.removeEventListener('mousedown', fecharAoClicarFora);
      document.removeEventListener('keydown', fecharComEsc);
    };
  }, [aberto]);

  return (
    <div className="menu-conta" ref={raiz}>
      <button
        type="button"
        className="menu-conta__avatar"
        aria-label={`Menu da conta de ${nome}`}
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((valor) => !valor)}
      >
        {inicial}
      </button>

      {aberto && (
        <div className="menu-conta__painel" role="menu">
          <p className="menu-conta__nome">{nome}</p>
          {ehOng && (
            <>
              <Link
                to={`/ongs/${perfil.id}`}
                className="menu-conta__item"
                role="menuitem"
                onClick={() => setAberto(false)}
              >
                Minha ONG
              </Link>
              <Link
                to="/pets/cadastro"
                className="menu-conta__item"
                role="menuitem"
                onClick={() => setAberto(false)}
              >
                Cadastrar pet
              </Link>
            </>
          )}
          <button
            type="button"
            className="menu-conta__item menu-conta__item--sair"
            role="menuitem"
            onClick={() => {
              setAberto(false);
              onSair();
            }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
