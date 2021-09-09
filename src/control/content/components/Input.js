import React from 'react';

const Input = ({ name, pattern, value, onChange, placeholder, showLabel }) => {
  let label = '';
  label += name[0].toUpperCase();
  label += name.slice(1);

  return (
    <div className="input--text label--horizontal flex-auto">
      {showLabel ? <label htmlFor={name}>{label}*</label> : null}
      <input className={"form-control flex-auto" + ( value.length === 0 ? ' border-danger' : '')} type="text" pattern={pattern} name={name} onChange={onChange} placeholder={placeholder || ''} value={value} />
      {value.length === 0 && <div className="text-left text-danger margin-top-five text-small">
            Required
      </div>}
    </div>
  );
};

export default Input;
