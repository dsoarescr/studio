import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedPixelPurchaseModal } from '@/components/pixel-grid/EnhancedPixelPurchaseModal';
import { useAuth } from '@/lib/auth-context';

jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('EnhancedPixelPurchaseModal', () => {
  const mockPixelData = {
    x: 100,
    y: 200,
    region: 'Lisboa',
    price: 150,
    rarity: 'Raro',
    views: 1000,
    likes: 50,
    specialCreditsPrice: 75,
  };

  const mockOnPurchase = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pixel information correctly', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'test-user', email: 'test@example.com' },
    });

    render(
      <EnhancedPixelPurchaseModal
        isOpen={true}
        onClose={mockOnClose}
        pixelData={mockPixelData}
        userCredits={1000}
        userSpecialCredits={100}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText('(100, 200) • Lisboa')).toBeInTheDocument();
    expect(screen.getByText('Raro')).toBeInTheDocument();
  });

  it('shows authentication required when user is not logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });

    render(
      <EnhancedPixelPurchaseModal
        isOpen={true}
        onClose={mockOnClose}
        pixelData={mockPixelData}
        userCredits={1000}
        userSpecialCredits={100}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText('Autenticação Necessária')).toBeInTheDocument();
  });

  it('handles purchase flow correctly', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'test-user', email: 'test@example.com' },
    });

    mockOnPurchase.mockResolvedValue(true);

    render(
      <EnhancedPixelPurchaseModal
        isOpen={true}
        onClose={mockOnClose}
        pixelData={mockPixelData}
        userCredits={1000}
        userSpecialCredits={100}
        onPurchase={mockOnPurchase}
      />
    );

    // Click continue to go to step 2
    const continueButton = screen.getByText('Continuar Compra');
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText('Escolha o Método de Pagamento')).toBeInTheDocument();
    });

    // Click purchase button
    const purchaseButton = screen.getByText(/Comprar por/);
    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(mockOnPurchase).toHaveBeenCalledWith(
        mockPixelData,
        'credits',
        expect.any(Object)
      );
    });
  });

  it('shows insufficient credits warning', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'test-user', email: 'test@example.com' },
    });

    render(
      <EnhancedPixelPurchaseModal
        isOpen={true}
        onClose={mockOnClose}
        pixelData={mockPixelData}
        userCredits={50} // Less than required
        userSpecialCredits={10}
        onPurchase={mockOnPurchase}
      />
    );

    const continueButton = screen.getByText('Continuar Compra');
    fireEvent.click(continueButton);

    expect(screen.getByText('Insuficiente')).toBeInTheDocument();
  });
});