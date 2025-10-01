// hooks/useClickOutside.ts
import { useEffect } from 'react';

type AnyRef<T extends HTMLElement> = { current: T | null };

export const useClickOutside = <T extends HTMLElement>(
  ref: AnyRef<T>,
  active: boolean,
  onOutside: (ev: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    if (!active) return;

    const handler = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return; // 내부 클릭은 무시
      onOutside(e);
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [ref, active, onOutside]);
};
