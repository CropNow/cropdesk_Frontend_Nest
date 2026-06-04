import { createContext, useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface FontScaleContextType {
  fontScale: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const STORAGE_KEY = 'cropdesk_font_scale';
const MIN_SCALE = 0.8;
const MAX_SCALE = 1.4;
const DEFAULT_SCALE = 1;
const STEP = 0.1;

const FontScaleContext = createContext<FontScaleContextType | null>(null);

function getStoredFontScale(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed) && parsed >= MIN_SCALE && parsed <= MAX_SCALE) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_SCALE;
}

function applyFontScale(scale: number) {
  document.documentElement.style.setProperty('--font-scale', scale.toString());
}

export function FontScaleProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useState<number>(getStoredFontScale);

  useLayoutEffect(() => {
    applyFontScale(fontScale);
  }, [fontScale]);

  const increaseFontSize = useCallback(() => {
    setFontScale((prev) => Math.min(prev + STEP, MAX_SCALE));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontScale((prev) => Math.max(prev - STEP, MIN_SCALE));
  }, []);

  const resetFontSize = useCallback(() => {
    setFontScale(DEFAULT_SCALE);
  }, []);

  useEffect(() => {
    applyFontScale(getStoredFontScale());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, fontScale.toString());
  }, [fontScale]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const parsed = parseFloat(e.newValue);
        if (!isNaN(parsed) && parsed >= MIN_SCALE && parsed <= MAX_SCALE) {
          setFontScale(parsed);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <FontScaleContext.Provider value={{ fontScale, increaseFontSize, decreaseFontSize, resetFontSize }}>
      {children}
    </FontScaleContext.Provider>
  );
}

export function useFontScale() {
  const ctx = useContext(FontScaleContext);
  if (!ctx) throw new Error('useFontScale must be used within FontScaleProvider');
  return ctx;
}