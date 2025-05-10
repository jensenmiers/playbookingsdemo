require('@testing-library/jest-dom');

// Mock URL.createObjectURL for jsdom
global.URL.createObjectURL = jest.fn(() => "/mock-url");
 
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}; 