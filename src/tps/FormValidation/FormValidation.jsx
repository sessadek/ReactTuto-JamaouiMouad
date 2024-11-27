import React, { useState } from 'react';
import Field from './Field'; // Adjust the path based on your folder structure

const FormValidation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
    acceptCondition: false,
  });

  const [errors, setErrors] = useState({});

  // Validation logic
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required.';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid.';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone is required.';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'Phone number must be 10 digits.';
        }
        break;
      case 'message':
        if (!value.trim()) error = 'Message is required.';
        break;
      case 'date':
        if (!value) error = 'Date is required.';
        break;
      case 'acceptCondition':
        if (!value) error = 'You must accept the terms and conditions.';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    // Update the field value
    setFormData({ ...formData, [name]: fieldValue });

    // Validate the field and update errors accordingly
    const error = validateField(name, fieldValue);
    if (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    } else {
      // Clear the error if the input is valid
      setErrors((prevErrors) => {
        const { [name]: _, ...updatedErrors } = prevErrors; // Remove the field from errors
        return updatedErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Collect all errors
    const validationErrors = Object.keys(formData).reduce((acc, field) => {
      const error = validateField(field, formData[field]);
      if (error) acc[field] = error;
      return acc;
    }, {});

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log('Form submitted:', formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        date: new Date().toISOString().split('T')[0],
        acceptCondition: false,
      });
      setErrors({});
    }
  };

  const errorList = Object.values(errors);

  return (
    <div className="container mt-4">
      {errorList.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">
            {errorList.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Field
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          label="Phone"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <Field
          label="Message"
          type="textarea"
          name="message"
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
        />
        <Field
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
        />
        <Field
          label="Accept Terms and Conditions"
          type="checkbox"
          name="acceptCondition"
          checked={formData.acceptCondition}
          onChange={handleChange}
          error={errors.acceptCondition}
        />
        <button type="submit" className="btn btn-primary" disabled={Object.keys(errors).length > 0}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormValidation;
