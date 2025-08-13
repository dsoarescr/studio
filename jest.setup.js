import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
  facebookProvider: {},
  twitterProvider: {},
  githubProvider: {},
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
  useMotionValue: () => ({ set: jest.fn(), get: jest.fn() }),
  useTransform: () => ({ set: jest.fn(), get: jest.fn() }),
}));

// Mock Web APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Mock Canvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  drawImage: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Uint8ClampedArray(4),
  })),
  putImageData: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  stroke: jest.fn(),
  strokeRect: jest.fn(),
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 1,
  imageSmoothingEnabled: true,
}));