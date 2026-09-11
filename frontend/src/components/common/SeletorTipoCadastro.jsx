import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import './SeletorTipoCadastro.css';

const OPCOES = [
  { valor: 'usuario', rotulo: 'Tutor', icone: 'paw', to: '/usuarios/cadastro' },
  { valor: 'ong', rotulo: 'ONG', icone: 'shelter', to: '/ongs/cadastro' },
];

export function SeletorTipoCadastro({ ativo }) {
  return (
    <div className="seletor-tipo-cadastro" role="tablist">
      {OPCOES.map((opcao) => (
        <Link
          key={opcao.valor}
          to={opcao.to}
          role="tab"
          aria-selected={opcao.valor === ativo}
          className={`seletor-tipo-cadastro__opcao${
            opcao.valor === ativo ? ' seletor-tipo-cadastro__opcao--ativa' : ''
          }`}
        >
          <Icon name={opcao.icone} size={18} />
          {opcao.rotulo}
        </Link>
      ))}
    </div>
  );
}
