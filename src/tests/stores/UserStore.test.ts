import { useUserStore } from '@/lib/store';
import { act, renderHook } from '@testing-library/react';

describe('UserStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      credits: 1000,
      specialCredits: 50,
      level: 1,
      xp: 0,
      xpMax: 1000,
      pixels: 0,
      achievements: 0,
      notifications: 0,
      isPremium: false,
      isVerified: false,
      streak: 0,
      lastLoginDate: null,
      totalSpent: 0,
      totalEarned: 0,
      favoriteColor: '#D4A757',
      joinDate: '2024-01-01',
    });
  });

  it('should add credits correctly', () => {
    const { result } = renderHook(() => useUserStore());
    
    act(() => {
      result.current.addCredits(500);
    });
    
    expect(result.current.credits).toBe(1500);
  });

  it('should remove credits correctly', () => {
    const { result } = renderHook(() => useUserStore());
    
    act(() => {
      result.current.removeCredits(300);
    });
    
    expect(result.current.credits).toBe(700);
  });

  it('should not allow negative credits', () => {
    const { result } = renderHook(() => useUserStore());
    
    act(() => {
      result.current.removeCredits(2000);
    });
    
    expect(result.current.credits).toBe(0);
  });

  it('should handle level up correctly', () => {
    const { result } = renderHook(() => useUserStore());
    
    act(() => {
      result.current.addXp(1100); // More than xpMax
    });
    
    expect(result.current.level).toBe(2);
    expect(result.current.xp).toBe(100);
    expect(result.current.xpMax).toBe(1200); // 20% increase
  });

  it('should handle multiple level ups', () => {
    const { result } = renderHook(() => useUserStore());
    
    act(() => {
      result.current.addXp(3500); // Enough for multiple levels
    });
    
    expect(result.current.level).toBeGreaterThan(2);
  });

  it('should update streak correctly', () => {
    const { result } = renderHook(() => useUserStore());
    
    act(() => {
      result.current.updateStreak();
    });
    
    expect(result.current.streak).toBe(1);
    expect(result.current.lastLoginDate).toBe(new Date().toISOString().split('T')[0]);
  });

  it('should track spending and earnings', () => {
    const { result } = renderHook(() => useUserStore());
    
    act(() => {
      result.current.addSpent(100);
      result.current.addEarned(50);
    });
    
    expect(result.current.totalSpent).toBe(100);
    expect(result.current.totalEarned).toBe(50);
  });
});