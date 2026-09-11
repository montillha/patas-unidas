import { Link } from 'react-router-dom';
import { Icon } from '../common/Icon';
import './OngCard.css';

export function OngCard({ ong }) {
  return (
    <Link to={`/ongs/${ong.id}`} className="ong-card">
      <span className="ong-card__icone" aria-hidden="true">
        <Icon name="shelter" size={22} />
      </span>
      <div>
        <h3 className="ong-card__nome">{ong.nome}</h3>
        <p className="ong-card__local">
          <Icon name="pin" size={14} />
          {ong.cidade}, {ong.estado}
        </p>
      </div>
    </Link>
  );
}
