import {
  formatNumber,
  isValidHexColor,
  hexToRgb,
  rgbToHex,
  getRandomColor,
  isLightColor,
  getComplementaryColor,
  calculateDistance,
  clamp,
  lerp,
  validatePassword,
  isValidEmail,
  formatFileSize,
  debounce,
  throttle,
} from '@/lib/utils';

describe('Utils Functions', () => {
  describe('formatNumber', () => {
    it('should format numbers with K, M, B suffixes', () => {
      expect(formatNumber(500)).toBe('500');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(1500000000)).toBe('1.5B');
    });
  });

  describe('isValidHexColor', () => {
    it('should validate hex colors correctly', () => {
      expect(isValidHexColor('#FF0000')).toBe(true);
      expect(isValidHexColor('#f00')).toBe(true);
      expect(isValidHexColor('FF0000')).toBe(false);
      expect(isValidHexColor('#GG0000')).toBe(false);
      expect(isValidHexColor('#FF00')).toBe(false);
    });
  });

  describe('hexToRgb', () => {
    it('should convert hex to RGB correctly', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('invalid')).toBe(null);
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });
  });

  describe('isLightColor', () => {
    it('should determine if color is light or dark', () => {
      expect(isLightColor('#FFFFFF')).toBe(true);
      expect(isLightColor('#000000')).toBe(false);
      expect(isLightColor('#808080')).toBe(true);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      expect(calculateDistance(0, 0, 3, 4)).toBe(5);
      expect(calculateDistance(0, 0, 0, 0)).toBe(0);
      expect(calculateDistance(-1, -1, 1, 1)).toBeCloseTo(2.83, 1);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should interpolate between values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
      expect(lerp(0, 10, 1.5)).toBe(10); // Should clamp
    });
  });

  describe('validatePassword', () => {
    it('should validate password strength', () => {
      const weak = validatePassword('123');
      expect(weak.isValid).toBe(false);
      expect(weak.score).toBeLessThan(4);

      const strong = validatePassword('MyStr0ng!Pass');
      expect(strong.isValid).toBe(true);
      expect(strong.score).toBe(5);
    });
  });

  describe('isValidEmail', () => {
    it('should validate email format', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.useRealTimers();
    });
  });
});