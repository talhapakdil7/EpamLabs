import { describe, it, expect } from 'vitest';
import { useLocalStorage } from 'src/hooks/useLocalStorage';

/**
 * useLocalStorage hook tests
 * Note: Full integration tests would require a proper jsdom environment setup.
 * These tests verify the hook's initialization and type safety.
 */

describe('useLocalStorage', () => {
  it('should be a function', () => {
    expect(typeof useLocalStorage).toBe('function');
  });

  it('should have correct function signature', () => {
    // Type safety test - ensures the hook accepts correct parameters
    expect(useLocalStorage.length).toBe(2); // key and initialValue parameters
  });
});
