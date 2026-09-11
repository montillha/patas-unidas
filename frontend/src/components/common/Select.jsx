import { forwardRef } from 'react';
import './Input.css';

export const Select = forwardRef(function Select(
  { label, name, error, children, ...rest },
  ref
) {
  return (
    <div className={`input-field${error ? ' input-field--error' : ''}`}>
      <label htmlFor={name} className="input-field__label">
        {label}
      </label>
      <select id={name} name={name} ref={ref} className="input-field__control" {...rest}>
        {children}
      </select>
      {error && <p className="input-field__error">{error}</p>}
    </div>
  );
});
