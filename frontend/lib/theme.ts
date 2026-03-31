export const THEME_KEY = "spms_theme";

export type ThemeMode = "light" | "dark";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const value = window.localStorage.getItem(THEME_KEY);
  if (value === "dark" || value === "light") {
    return value;
  }

  return "light";
}

export function setStoredTheme(theme: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_KEY, theme);
}
