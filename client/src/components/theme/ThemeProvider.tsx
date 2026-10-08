"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "editmytrips-theme";

/**
 * Runs before first paint (inline in layout) so the saved theme is applied
 * with zero flash. Dark is the default: no class means dark, "light" adds
 * html.light. Deliberately never adds a `.dark` class — admin pages rely on
 * `dark:` variants staying inactive.
 */
export const themeInitScript = `(function(){try{if(localStorage.getItem("${STORAGE_KEY}")==="light"){var e=document.documentElement;e.classList.add("light");e.style.colorScheme="light"}}catch(e){}})()`;

function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate) root.classList.add("theme-anim");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  if (animate) {
    window.setTimeout(() => root.classList.remove("theme-anim"), 400);
  }
}

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}>({
  theme: "dark",
  setTheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Server renders "dark" (the site default); the effect syncs the real
  // value that the init script already applied to <html>.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    let stored: Theme = "dark";
    try {
      stored = localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
    } catch {}
    setThemeState(stored);
    applyTheme(stored, false);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t, true);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next, true);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
