// Form.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormValidation from './FormValidation'; // Adjust the path based on your folder structure

describe('Form Component', () => {
  beforeEach(() => {
    render(<FormValidation />);
  });

  test('renders the form with all fields', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accept terms and conditions/i)).toBeInTheDocument();
  });

  test('displays validation error messages on empty submit', () => {
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
  });

  test('displays an error when invalid email is entered', () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
  });

  test('displays an error when phone number is less than 10 digits', () => {
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/phone number must be 10 digits/i)).toBeInTheDocument();
  });

  test('does not submit the form when there are validation errors', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(consoleSpy).not.toHaveBeenCalled(); // Form should not log to console
    consoleSpy.mockRestore();
  });

  test('submits the form with valid data', () => {
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello there!' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: new Date().toISOString().split('T')[0] } });
    fireEvent.click(screen.getByLabelText(/accept terms and conditions/i));
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument(); // No error for name
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument(); // No error for email
    expect(screen.queryByText(/phone is required/i)).not.toBeInTheDocument(); // No error for phone
    expect(screen.queryByText(/message is required/i)).not.toBeInTheDocument(); // No error for message
    expect(screen.queryByText(/you must accept the terms and conditions/i)).not.toBeInTheDocument(); // No error for terms

    // Check that console log was called once
    const consoleSpy = jest.spyOn(console, 'log');
    expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Hello there!',
      date: new Date().toISOString().split('T')[0],
      acceptCondition: true,
    });
    consoleSpy.mockRestore();
  });
});
