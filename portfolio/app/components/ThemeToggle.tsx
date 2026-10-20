'use client';

import { useEffect, useState } from 'react';

type Theme = 'auto' | 'light' | 'dark';
const ORDER: Theme[] = ['auto', 'light', 'dark'];

// The saved choice is applied before paint by the inline script in layout.tsx;
// this button only cycles it. "auto" means follow the device setting.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('auto');

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'light' || current === 'dark') setTheme(current);
  }, []);

  function next() {
    const value = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    const root = document.documentElement;
    if (value === 'auto') delete root.dataset.theme;
    else root.dataset.theme = value;
    try {
      if (value === 'auto') localStorage.removeItem('theme');
      else localStorage.setItem('theme', value);
    } catch {
      // storage can be blocked (private mode); the theme still applies for this visit
    }
    setTheme(value);
  }

  return (
    <button type="button" className="theme-toggle" onClick={next} aria-label={`Theme: ${theme}. Click to change.`}>
      Theme: {theme}
    </button>
  );
}
