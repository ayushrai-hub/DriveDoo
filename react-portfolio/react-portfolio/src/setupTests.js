// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';

// Mock Vite import.meta.env
Object.defineProperty(window, 'importMeta', {
  value: {
    env: {
      MODE: 'test',
      DEV: true,
      PROD: false,
      SSR: false,
    },
  },
  writable: true,
});

// Mock CSS modules
const mockCssModule = {};
jest.mock('*.module.css', () => mockCssModule);
jest.mock('*.css', () => mockCssModule);

// Mock image imports
const mockImage = 'mock-image.png';
jest.mock('*.png', () => mockImage);
jest.mock('*.jpg', () => mockImage);
jest.mock('*.jpeg', () => mockImage);
jest.mock('*.gif', () => mockImage);
jest.mock('*.svg', () => mockImage);

// Mock Fontsource imports
jest.mock('@fontsource/outfit', () => ({}));
jest.mock('@fontsource/roboto', () => ({}));

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || 
       args[0].includes('React does not recognize') ||
       args[0].includes('Failed prop type'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('component is deprecated')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Setup IntersectionObserver mock for lazy loading tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Setup ResizeObserver mock
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Setup matchMedia mock for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Setup scrollTo mock
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Setup localStorage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Setup sessionStorage mock
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;