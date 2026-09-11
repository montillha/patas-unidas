import './Loader.css';

export function Loader({ texto = 'Carregando...' }) {
  return (
    <div className="loader">
      <span className="loader__spinner" aria-hidden="true" />
      <span>{texto}</span>
    </div>
  );
}
