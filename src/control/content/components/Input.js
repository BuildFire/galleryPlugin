import React from 'react';

const Input = ({ name, pattern, value, onChange, placeholder, showLabel }) => {
  let label = '';
  label += name[0].toUpperCase();
  label += name.slice(1);

  return (
    <div className="input--text label--horizontal flex-auto">
      {showLabel ? <label htmlFor={name}>{label}*</label> : null}
      <input className="form-control flex-auto" type="text" pattern={pattern} name={name} onChange={onChange} placeholder={placeholder || ''} value={value} />
    </div>
  );
};

export default Input;
