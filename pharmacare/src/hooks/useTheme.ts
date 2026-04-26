'use client';

import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

/**
 * Custom hook for managing theme consistently across devices
 * 
 * WHY THIS APPROACH:
 * 1. Single source of truth for theme state
 * 2. Prevents flickering by applying theme before render
 * 3. Ignores system preferences (manual control only)
 * 4. Uses strict color values for consistency
 * 5. Optimized for low-memory devices (minimal re-renders)
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Apply theme to DOM - memoized to prevent unnecessary calls
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof window === 'undefined') return;

    const html = document.documentElement;
    const body = document.body;

    // Remove both classes first to ensure clean state
    html.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    // Add the new theme class
    html.classList.add(newTheme);
    body.classList.add(newTheme);

    // Set strict background colors via inline styles
    // This ensures consistency even if CSS hasn't loaded
    if (newTheme === 'dark') {
      html.style.backgroundColor = '#000000';
      body.style.backgroundColor = '#000000';
      html.style.colorScheme = 'dark'; // Hint to browser for native elements
    } else {
      html.style.backgroundColor = '#ffffff';
      body.style.backgroundColor = '#ffffff';
      html.style.colorScheme = 'light';
    }

    // Store in localStorage for persistence
    localStorage.setItem('theme', newTheme);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme or default to light
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
    setMounted(true);
  }, [applyTheme]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  // Set specific theme
  const setThemeMode = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  return {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    mounted, // Use this to prevent hydration mismatches
  };
}
