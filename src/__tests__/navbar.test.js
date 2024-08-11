import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navbar } from '../Components/Navbar.js';
import { MemoryRouter } from 'react-router-dom';
import { CartContext } from '../Global/CartContext';
import '@testing-library/jest-dom';
import { deleteUser } from 'firebase/auth';


jest.mock('../Config/Config', () => ({
  auth: {
    currentUser: { uid: 'testuid', email: 'test@example.com' },
    signOut: jest.fn(() => Promise.resolve()),
  },
  db: {},
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({ Name: 'Test User', Email: 'test@example.com' }) })),
}));

jest.mock('firebase/auth', () => ({ 
  sendPasswordResetEmail: jest.fn(),
  deleteUser: jest.fn()
})
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockUser = 'Test User';

describe('Navbar component', () => {
  it('should render logout button for logged in user', () => {
    render(
      <MemoryRouter>
        <CartContext.Provider value={{ totalQty: 0 }}>
          <Navbar user={mockUser} />
        </CartContext.Provider>
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should logout when clicked on the button', async () => {
    const { auth, sendPasswordResetEmail } = require('../Config/Config');

    render(
      <MemoryRouter>
        <CartContext.Provider value={{ totalQty: 0 }}>
          <Navbar user={mockUser} />
        </CartContext.Provider>
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(auth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  it('should render username for logged in user', () => {
    render(
      <MemoryRouter>
        <CartContext.Provider value={{ totalQty: 0 }}>
          <Navbar user={mockUser} />
        </CartContext.Provider>
      </MemoryRouter>
    );

    const editProfileLink = screen.getByText(mockUser);
    expect(editProfileLink).toBeInTheDocument();
  });

  it('should open edit profile modal when click on the username', async () => {
    render(
      <MemoryRouter>
        <CartContext.Provider value={{ totalQty: 0 }}>
          <Navbar user={mockUser} />
        </CartContext.Provider>
      </MemoryRouter>
    );

    const editProfileLink = screen.getByText(mockUser);
    fireEvent.click(editProfileLink);

    await waitFor(() => {
      const modal = screen.getByText('Edit Profile');
      expect(modal).toBeInTheDocument();
    });
  });

  it('should display username and email fields in the modal', async () => {
    render(
      <MemoryRouter>
        <CartContext.Provider value={{ totalQty: 0 }}>
          <Navbar user={mockUser} />
        </CartContext.Provider>
      </MemoryRouter>
    );

    const editProfileLink = screen.getByText(mockUser);
    fireEvent.click(editProfileLink);

    await waitFor(() => {
      const usernameInput = screen.getByLabelText(/Username/i);
      const emailInput = screen.getByLabelText(/Email/i);

      expect(usernameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toBeDisabled();
    });
  });

  it('should send a password resent email when reset password button', async () => {
    const { sendPasswordResetEmail } = require('firebase/auth');

    render(
      <MemoryRouter>
        <CartContext.Provider value={{ totalQty: 0 }}>
          <Navbar user={mockUser} />
        </CartContext.Provider>
      </MemoryRouter>
    );

    const editProfileLink = screen.getByText(mockUser);
    fireEvent.click(editProfileLink);

    await waitFor(() => {
      const resetPasswordButton = screen.getByRole('button',{name: 'Reset Password'});
      fireEvent.click(resetPasswordButton);
    })

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    });
  });

  it('should delete the account when click on the button', async () => {
    const { deleteUser } = require('firebase/auth');

    render(
      <MemoryRouter>
        <CartContext.Provider value={{ totalQty: 0 }}>
          <Navbar user={mockUser} />
        </CartContext.Provider>
      </MemoryRouter>
    );

    const editProfileLink = screen.getByText(mockUser);
    fireEvent.click(editProfileLink);

    await waitFor(() => {
      const deleteAccountButton = screen.getByRole('button', { name: 'Delete Account' });
      fireEvent.click(deleteAccountButton);
    });

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledTimes(1);
    });
  });

  it('should update username and close modal when click save button ', async () => {
    const { updateDoc } = require('../Config/Config');
    updateDoc.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <CartContext.Provider value={{ totalQty: 0 }}>
          <Navbar user={mockUser} />
        </CartContext.Provider>
      </MemoryRouter>
    );

    const editProfileLink = screen.getByText(mockUser);
    fireEvent.click(editProfileLink);

    await waitFor(() => {
      const usernameInput = screen.getByLabelText(/Username/i);
      fireEvent.change(usernameInput, { target: { value: 'New Username' } });

      const saveButton = screen.getByRole('button', { name: /Save/i });
      fireEvent.click(saveButton);
    });

    expect(updateDoc).toHaveBeenCalled();

    await waitFor(() => {
      const modal = screen.queryByText('Edit Profile');
      expect(modal).not.toBeInTheDocument();
    });
  });
});