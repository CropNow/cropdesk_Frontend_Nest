import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface FontScaleContextType {
  fontScale: number;
  setFontScale: (scale: number) => void;
}

const STORAGE_KEY = 'cropdesk_font_scale';
const VALID_SCALES = [1, 1.25, 1.5, 1.75, 2] as const;

const FontScaleContext = createContext<FontScaleContextType | null>(null);

function getStoredScale(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseFloat(stored);
      if (VALID_SCALES.includes(parsed as any)) return parsed;
    }
  } catch {}
  return 1;
}

export function FontScaleProvider({ children }: { children: ReactNode }) {
  const [fontScale, setScaleState] = useState<number>(getStoredScale);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  const setFontScale = useCallback((scale: number) => {
    setScaleState(scale);
    try {
      localStorage.setItem(STORAGE_KEY, scale.toString());
    } catch {}
  }, []);

  return (
    <FontScaleContext.Provider value={{ fontScale, setFontScale }}>
      {children}
    </FontScaleContext.Provider>
  );
}

export function useFontScale() {
  const ctx = useContext(FontScaleContext);
  if (!ctx) throw new Error('useFontScale must be used within FontScaleProvider');
  return ctx;
}

export { VALID_SCALES };