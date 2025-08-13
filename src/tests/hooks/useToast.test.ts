import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/use-toast';

describe('useToast Hook', () => {
  it('should initialize with empty toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('should add toast correctly', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This is a test toast',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('This is a test toast');
  });

  it('should dismiss toast correctly', () => {
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    
    act(() => {
      const toast = result.current.toast({
        title: 'Test Toast',
      });
      toastId = toast.id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });

    // Toast should be marked as closed but still in array initially
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should limit number of toasts', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      // Add multiple toasts (limit is 1 in the implementation)
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
      result.current.toast({ title: 'Toast 3' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Toast 3'); // Latest should be shown
  });
});