import { useState, useEffect } from 'react';

/**
 * Custom hook for reading and writing to localStorage.
 * All localStorage operations in the app must go through this hook.
 * @param key - The localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns Tuple of [value, setValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T): void => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
