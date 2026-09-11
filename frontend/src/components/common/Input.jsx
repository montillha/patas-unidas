import { forwardRef } from 'react';
import './Input.css';

export const Input = forwardRef(function Input(
  { label, name, type = 'text', error, ...rest },
  ref
) {
  return (
    <div className={`input-field${error ? ' input-field--error' : ''}`}>
      <label htmlFor={name} className="input-field__label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        ref={ref}
        className="input-field__control"
        {...rest}
      />
      {error && <p className="input-field__error">{error}</p>}
    </div>
  );
});
