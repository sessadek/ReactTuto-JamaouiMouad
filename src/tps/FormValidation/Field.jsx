import React from 'react';

const Field = ({ label, type, name, value, onChange, error, checked }) => {
  return (
    <div className="form-group mb-3">
      {type === 'checkbox' ? (
        <div className="form-check">
          <input
            type={type}
            className={`form-check-input ${error ? 'is-invalid' : ''}`}
            id={name}
            name={name}
            checked={checked}
            onChange={onChange}
          />
          <label className="form-check-label" htmlFor={name}>
            {label}
          </label>
          {error && <div className="invalid-feedback d-block">{error}</div>} {/* Show error message */}
        </div>
      ) : (
        <>
          <label htmlFor={name}>{label}:</label>
          {type === 'textarea' ? (
            <textarea
              className={`form-control ${error ? 'is-invalid' : ''}`}
              id={name}
              name={name}
              value={value}
              onChange={onChange}
            />
          ) : (
            <input
              type={type}
              className={`form-control ${error ? 'is-invalid' : ''}`}
              id={name}
              name={name}
              value={value}
              onChange={onChange}
            />
          )}
          {error && <div className="invalid-feedback">{error}</div>} {/* Show error message for non-checkbox fields */}
        </>
      )}
    </div>
  );
};

export default Field;
