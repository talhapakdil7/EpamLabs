import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Setup localStorage mock for jsdom
beforeEach(() => {
  // Clear localStorage before each test
  try {
    if (global.localStorage) {
      global.localStorage.clear();
    }
  } catch (e) {
    // Ignore errors if localStorage doesn't support clear
  }
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  try {
    if (global.localStorage) {
      global.localStorage.clear();
    }
  } catch (e) {
    // Ignore errors
  }
});

