import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';

// Mock the auth context
jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
}));

// Mock the user store
jest.mock('@/lib/store', () => ({
  useUserStore: jest.fn(),
}));

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('UserMenu Component', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/avatar.jpg',
  };

  const mockUserStore = {
    credits: 1000,
    specialCredits: 50,
    level: 5,
    xp: 250,
    xpMax: 500,
    achievements: 3,
    notifications: 2,
    isPremium: false,
    isVerified: true,
    clearNotifications: jest.fn(),
  };

  beforeEach(() => {
    (useUserStore as jest.Mock).mockReturnValue(mockUserStore);
  });

  it('renders login button when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      logOut: jest.fn(),
    });

    render(<UserMenu />);
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('renders user menu when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logOut: jest.fn(),
    });

    render(<UserMenu />);
    
    // Should show user avatar
    const avatar = screen.getByRole('button');
    expect(avatar).toBeInTheDocument();
  });

  it('displays user information in dropdown', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logOut: jest.fn(),
    });

    render(<UserMenu />);
    
    // Click to open dropdown
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Nível 5')).toBeInTheDocument();
    });
  });

  it('shows correct XP progress', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logOut: jest.fn(),
    });

    render(<UserMenu />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('250/500')).toBeInTheDocument();
    });
  });

  it('handles logout correctly', async () => {
    const mockLogOut = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logOut: mockLogOut,
    });

    render(<UserMenu />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    await waitFor(() => {
      const logoutButton = screen.getByText('Terminar Sessão');
      fireEvent.click(logoutButton);
      expect(mockLogOut).toHaveBeenCalled();
    });
  });
});