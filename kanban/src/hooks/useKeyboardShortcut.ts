import { useEffect } from 'react';

export function useKeyboardShortcut(key: string, handler: () => void) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const active = document.activeElement;
      const isTyping = active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName);

      if (event.key.toLowerCase() === key.toLowerCase() && !event.ctrlKey && !event.metaKey && !event.altKey && !isTyping) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handler, key]);
}
