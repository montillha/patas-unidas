import { Link } from 'react-router-dom';
import { Icon } from '../common/Icon';
import { formatarIdade, rotuloEspecie, rotuloPorte } from '../../utils/petLabels';
import './PetCard.css';

export function PetCard({ pet }) {
  const capa = pet.fotos?.[0];
  const adotado = pet.status === 'adotado';

  return (
    <Link to={`/pets/${pet.id}`} className="pet-card">
      <div className="pet-card__capa">
        {capa ? (
          <img src={capa.url} alt={`Foto de ${pet.nome}`} className="pet-card__foto" loading="lazy" />
        ) : (
          <span className="pet-card__placeholder" aria-hidden="true">
            <Icon name={pet.especie === 'gato' ? 'cat' : 'dog'} size={44} />
          </span>
        )}
        {adotado && <span className="pet-card__selo">Adotado</span>}
      </div>

      <div className="pet-card__corpo">
        <h3 className="pet-card__nome">
          {pet.nome} · {rotuloEspecie(pet.especie)}
        </h3>
        <p className="pet-card__detalhe">
          {formatarIdade(pet.idade_anos)} · {rotuloPorte(pet.porte)}
        </p>
        {pet.cidade && (
          <p className="pet-card__detalhe">
            {pet.cidade}, {pet.estado}
          </p>
        )}
      </div>
    </Link>
  );
}
