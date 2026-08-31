// Tests hit a real SQLite file kept separate from the dev database so
// running the test suite never disturbs data used for local manual demos.
// Prisma resolves relative sqlite paths relative to schema.prisma's
// directory (prisma/), not the process cwd — so this resolves to
// prisma/test.db, matching dev.db's sibling location.
process.env.DATABASE_URL = "file:./test.db";

import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia; embla-carousel (used by the hero and
// testimonials carousels) reads it on mount. Only defined when a DOM exists
// (jsdom test files), not in the plain "node" environment tests use by
// default.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}

if (typeof window !== "undefined" && !window.IntersectionObserver) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

if (typeof window !== "undefined" && !window.ResizeObserver) {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
}
