import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from 'date-fns';
import { pt, enUS, es } from 'date-fns/locale';
import { useUserStore } from './store';

// Map of supported locales
const locales = {
  'pt-PT': pt,
  'en-US': enUS,
  'es-ES': es
};

// Get current locale from localStorage or default to Portuguese
export function getCurrentLocale(): 'pt-PT' | 'en-US' | 'es-ES' {
  if (typeof window === 'undefined') return 'pt-PT';
  return (localStorage.getItem('pixel-universe-locale') as 'pt-PT' | 'en-US' | 'es-ES') || 'pt-PT';
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a human-readable string
 * @param date The date to format
 * @param formatStr The format string to use
 * @returns The formatted date string
 */
export function formatDate(date: Date | string, formatStr: string = 'PPP', locale?: 'pt-PT' | 'en-US' | 'es-ES'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const selectedLocale = locale || getCurrentLocale();
  return format(dateObj, formatStr, { locale: locales[selectedLocale] });
}

/**
 * Returns a human-readable string representing the time elapsed since the given date
 * @param date The date to calculate the time from
 * @returns A string like "2 minutos atrás", "3 horas atrás", etc.
 */
export function timeAgo(date: Date | string, locale?: 'pt-PT' | 'en-US' | 'es-ES'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const selectedLocale = locale || getCurrentLocale();
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: locales[selectedLocale] });
}

/**
 * Formats a number to a human-readable string with K, M, B suffixes
 * @param num The number to format
 * @returns The formatted number string
 */
export function formatNumber(num: number | null | undefined): string {
  if (num == null) return '0';
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Formats a large number with appropriate suffixes and animations
 * @param num The number to format
 * @param animated Whether to show animated counting
 * @returns The formatted number string
 */
export function formatNumberAnimated(num: number, animated: boolean = false): string {
  if (animated) {
    // This would be used with a counter animation component
    return formatNumber(num);
  }
  return formatNumber(num);
}

/**
 * Calculates the reading time for a text
 * @param text The text to analyze
 * @param wordsPerMinute Average reading speed
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Validates if a color is valid hex format
 * @param color The color string to validate
 * @returns true if valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Converts hex color to RGB values
 * @param hex The hex color string
 * @returns RGB object or null if invalid
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!isValidHexColor(hex)) return null;
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts RGB to hex color
 * @param r Red value (0-255)
 * @param g Green value (0-255)
 * @param b Blue value (0-255)
 * @returns Hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Generates a random color in hex format
 * @returns A random hex color string
 */
export function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Calculates the contrast ratio between two colors
 * @param color1 The first color in hex format
 * @param color2 The second color in hex format
 * @returns The contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const rgb = [r, g, b].map(v => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Determines if a color is light or dark
 * @param color The color in hex format
 * @returns true if the color is light, false if it's dark
 */
export function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate the perceived brightness using the formula
  // (0.299*R + 0.587*G + 0.114*B)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 128;
}

/**
 * Generates a complementary color
 * @param color The base color in hex format
 * @returns The complementary color in hex format
 */
export function getComplementaryColor(color: string): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

/**
 * Generates a color palette based on a base color
 * @param baseColor The base color in hex format
 * @param count Number of colors to generate
 * @returns Array of hex color strings
 */
export function generateColorPalette(baseColor: string, count: number = 5): string[] {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor];
  
  const palette: string[] = [baseColor];
  
  for (let i = 1; i < count; i++) {
    const factor = i / count;
    const newR = Math.round(rgb.r + (255 - rgb.r) * factor);
    const newG = Math.round(rgb.g + (255 - rgb.g) * factor);
    const newB = Math.round(rgb.b + (255 - rgb.b) * factor);
    palette.push(rgbToHex(newR, newG, newB));
  }
  
  return palette;
}

// Approximate GPS bounding box for Portugal Continental
const PORTUGAL_GPS_BOUNDS = {
  MIN_LAT: 36.96, // Approximate minimum latitude
  MAX_LAT: 42.15, // Approximate maximum latitude
  MIN_LON: -9.5,  // Approximate minimum longitude (West is negative)
  MAX_LON: -6.18, // Approximate maximum longitude
};

/**
 * Maps logical pixel coordinates to approximate GPS coordinates using linear interpolation.
 * IMPORTANT: This is a highly simplified approximation and not geographically accurate.
 * It does not account for map projections or the Earth's curvature.
 *
 * @param logicalCol The column of the pixel in the logical grid.
 * @param logicalRow The row of the pixel in the logical grid.
 * @param totalLogicalCols The total number of columns in the logical grid.
 * @param totalLogicalRows The total number of rows in the logical grid.
 * @returns An object with approximate lat and lon, or null if inputs are invalid.
 */
export function mapPixelToApproxGps(
  logicalCol: number,
  logicalRow: number,
  totalLogicalCols: number,
  totalLogicalRows: number
): { lat: number; lon: number } | null {
  if (
    totalLogicalCols <= 0 ||
    totalLogicalRows <= 0 ||
    logicalCol < 0 ||
    logicalCol >= totalLogicalCols ||
    logicalRow < 0 ||
    logicalRow >= totalLogicalRows
  ) {
    return null; // Invalid input
  }

  // Calculate relative position (0.0 to 1.0)
  const relX = logicalCol / (totalLogicalCols -1); // Normalize to 0-1 range
  const relY = logicalRow / (totalLogicalRows - 1); // Normalize to 0-1 range

  // Interpolate longitude (more straightforward: left to right)
  const lon = PORTUGAL_GPS_BOUNDS.MIN_LON + relX * (PORTUGAL_GPS_BOUNDS.MAX_LON - PORTUGAL_GPS_BOUNDS.MIN_LON);

  // Interpolate latitude (inverted: SVG Y is top-to-bottom, Latitude is bottom-to-top)
  const lat = PORTUGAL_GPS_BOUNDS.MAX_LAT - relY * (PORTUGAL_GPS_BOUNDS.MAX_LAT - PORTUGAL_GPS_BOUNDS.MIN_LAT);
  // Or, if SVG top matches GPS North:
  // const lat = PORTUGAL_GPS_BOUNDS.MIN_LAT + (1 - relY) * (PORTUGAL_GPS_BOUNDS.MAX_LAT - PORTUGAL_GPS_BOUNDS.MIN_LAT);

  return {
    lat: parseFloat(lat.toFixed(6)), // Keep reasonable precision
    lon: parseFloat(lon.toFixed(6)),
  };
}

/**
 * Debounces a function call
 * @param func The function to debounce
 * @param wait The time to wait in milliseconds
 * @returns A debounced function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function call
 * @param func The function to throttle
 * @param limit The time limit in milliseconds
 * @returns A throttled function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  
  return function(...args: Parameters<T>): void {
    const context = this;
    
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      lastRan = Date.now();
      setTimeout(() => {
        inThrottle = false;
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Checks if the device is a mobile device
 * @returns true if the device is mobile, false otherwise
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Checks if the device has low performance capabilities
 * @returns true if the device has low performance, false otherwise
 */
export function isLowPerformanceDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    navigator.hardwareConcurrency <= 4 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator as any).deviceMemory < 4
  );
}

/**
 * Generates a unique ID
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Safely parses JSON with error handling
 * @param json The JSON string to parse
 * @param fallback The fallback value if parsing fails
 * @returns The parsed JSON or the fallback value
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
}

/**
 * Validates email format
 * @param email The email string to validate
 * @returns true if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param password The password to validate
 * @returns Object with validation results
 */
export function validatePassword(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 1;
  else feedback.push('Deve ter pelo menos 8 caracteres');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Deve conter pelo menos uma letra minúscula');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Deve conter pelo menos uma letra maiúscula');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Deve conter pelo menos um número');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Deve conter pelo menos um caractere especial');
  
  return {
    isValid: score >= 4,
    score,
    feedback
  };
}

/**
 * Formats file size in human readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculates the distance between two points
 * @param x1 First point X coordinate
 * @param y1 First point Y coordinate
 * @param x2 Second point X coordinate
 * @param y2 Second point Y coordinate
 * @returns Distance between points
 */
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Checks if a point is within a rectangular area
 * @param point The point to check
 * @param area The rectangular area
 * @returns true if point is within area
 */
export function isPointInArea(
  point: { x: number; y: number },
  area: { x: number; y: number; width: number; height: number }
): boolean {
  return point.x >= area.x && 
         point.x <= area.x + area.width &&
         point.y >= area.y && 
         point.y <= area.y + area.height;
}

/**
 * Generates a random ID with prefix
 * @param prefix Optional prefix for the ID
 * @returns Random ID string
 */
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Clamps a number between min and max values
 * @param value The value to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param start Start value
 * @param end End value
 * @param factor Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * clamp(factor, 0, 1);
}

/**
 * Converts degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees
 * @param radians Angle in radians
 * @returns Angle in degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Checks if user has sufficient credits for a purchase
 * @param price The price to check
 * @param userCredits User's current credits
 * @param userSpecialCredits User's special credits
 * @param acceptSpecialCredits Whether special credits can be used
 * @returns Object with affordability information
 */
export function checkAffordability(
  price: number,
  userCredits: number,
  userSpecialCredits: number = 0,
  acceptSpecialCredits: boolean = false
): {
  canAfford: boolean;
  canAffordWithSpecial: boolean;
  shortfall: number;
  paymentOptions: Array<{
    type: 'credits' | 'special' | 'mixed';
    amount: number;
    label: string;
  }>;
} {
  const canAfford = userCredits >= price;
  const canAffordWithSpecial = acceptSpecialCredits && (userCredits + userSpecialCredits) >= price;
  const shortfall = Math.max(0, price - userCredits);
  
  const paymentOptions = [];
  
  if (canAfford) {
    paymentOptions.push({
      type: 'credits' as const,
      amount: price,
      label: `${price} créditos`
    });
  }
  
  if (acceptSpecialCredits && userSpecialCredits > 0) {
    const specialCreditsNeeded = Math.min(userSpecialCredits, shortfall);
    const regularCreditsNeeded = price - specialCreditsNeeded;
    
    if (regularCreditsNeeded <= userCredits) {
      paymentOptions.push({
        type: 'mixed' as const,
        amount: price,
        label: `${regularCreditsNeeded} créditos + ${specialCreditsNeeded} especiais`
      });
    }
  }
  
  return {
    canAfford,
    canAffordWithSpecial,
    shortfall,
    paymentOptions
  };
}

/**
 * Calculates XP needed for next level
 * @param currentLevel Current user level
 * @param currentXp Current XP amount
 * @returns XP needed for next level
 */
export function calculateXpForNextLevel(currentLevel: number, currentXp: number): {
  xpNeeded: number;
  xpMax: number;
  progress: number;
} {
  const baseXp = 1000;
  const xpMax = Math.floor(baseXp * Math.pow(1.2, currentLevel - 1));
  const xpNeeded = xpMax - currentXp;
  const progress = (currentXp / xpMax) * 100;
  
  return { xpNeeded, xpMax, progress };
}

/**
 * Formats a coordinate pair for display
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Formatted coordinate string
 */
export function formatCoordinates(x: number, y: number): string {
  return `(${x}, ${y})`;
}

/**
 * Checks if coordinates are valid within bounds
 * @param x X coordinate
 * @param y Y coordinate
 * @param maxX Maximum X value
 * @param maxY Maximum Y value
 * @returns true if coordinates are valid
 */
export function areValidCoordinates(x: number, y: number, maxX: number, maxY: number): boolean {
  return x >= 0 && x < maxX && y >= 0 && y < maxY;
}