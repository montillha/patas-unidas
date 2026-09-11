import { Link } from 'react-router-dom';
import { Icon } from '../common/Icon';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="footer__brand">
        <Icon name="paw" size={18} />
        Patas Unidas
      </Link>
      <span className="footer__link">@patasunidas</span>
    </footer>
  );
}
