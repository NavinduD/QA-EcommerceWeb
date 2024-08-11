import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../Components/Login';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../Config/Config', () => ({
  auth: {},
  signInWithEmailAndPassword: jest.fn(),
}));

describe('Login Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  it('should render login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LOGIN' })).toBeInTheDocument();
  });

  it('should sign in with valid credentials', async () => {
    const { signInWithEmailAndPassword } = require('../Config/Config');
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: '123' } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: '123456789' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'LOGIN' }));
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@gmail.com',
      '123456789'
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('should show error for invalid credentials', async () => {
    const { signInWithEmailAndPassword } = require('../Config/Config');
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password', message: 'Invalid password' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('email'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'wrongpassword' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'LOGIN' }));
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@gmail.com',
      'wrongpassword'
    );
    expect(screen.getByText('Invalid password')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show error for unregistered email', async () => {
    const { signInWithEmailAndPassword } = require('../Config/Config');
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/user-not-found', message: 'User not found' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('email'), { target: { value: 'unregistered@gmail.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: '123456789' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'LOGIN' }));
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'unregistered@gmail.com',
      '123456789'
    );
    expect(screen.getByText('User not found')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});