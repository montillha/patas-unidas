import './Button.css';

export function Button({ children, type = 'button', variant = 'accent', disabled, onClick }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn--${variant}`}
    >
      {children}
    </button>
  );
}
