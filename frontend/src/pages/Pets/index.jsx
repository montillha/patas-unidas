import { Link } from 'react-router-dom';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import './Pets.css';

export default function Pets() {
  return (
    <div className="pets-em-breve">
      <div className="pets-em-breve__icone" aria-hidden="true">
        <Icon name="paw" size={32} />
      </div>
      <h1 className="pets-em-breve__titulo">Em breve</h1>
      <p className="pets-em-breve__texto">
        Estamos preparando a listagem de pets disponíveis para adoção. Volte em breve!
      </p>
      <Link to="/ongs">
        <Button variant="outline-primary">Ver ONGs cadastradas</Button>
      </Link>
    </div>
  );
}
