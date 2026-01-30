import "@testing-library/jest-dom";

// Polyfill ResizeObserver used by some UI libs (Radix, etc.)
class ResizeObserver {
  //   observe() {}
  //   unobserve() {}
  //   disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;
