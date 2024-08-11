import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Signup } from '../Components/Signup';
import '@testing-library/jest-dom';

// Mock the necessary modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../Config/Config', () => ({
  auth: {},
  db: {},
  createUserWithEmailAndPassword: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

describe('Signup Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  it('should render signup form', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByTestId('name')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SUBMIT' })).toBeInTheDocument();
  });

  it('should show error for invalid email', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'SUBMIT' }));
    });

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('should show error for weak password', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'weakpass' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'SUBMIT' }));
    });

    expect(screen.getByText('Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character')).toBeInTheDocument();
  });

  it('should create account with valid credentials', async () => {
    const { createUserWithEmailAndPassword, setDoc } = require('../Config/Config');
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: '123' } });
    setDoc.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'ValidPass123!' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'SUBMIT' }));
    });

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'ValidPass123!'
    );
    expect(setDoc).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should show error for existing email', async () => {
    const { createUserWithEmailAndPassword } = require('../Config/Config');
    createUserWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/email-already-in-use', message: 'Email already in use' });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'ValidPass123!' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'SUBMIT' }));
    });

    expect(screen.getByText('Email already in use')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});