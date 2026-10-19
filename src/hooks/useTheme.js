import { useEffect, useState } from "react";

const STORAGE_KEY = "devtinder-theme";
export const DARK = "devdark";
export const LIGHT = "devlight";

// Initial value: whatever index.html already put on <html> (saved choice or OS preference)
const getInitialTheme = () =>
  document.documentElement.getAttribute("data-theme") || DARK;

/**
 * Custom hook: keeps the theme in React state, mirrors it to the
 * <html data-theme="..."> attribute (daisyUI reads this) and to localStorage
 * so the choice survives a page refresh.
 */
const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode / storage blocked — theme still works for this visit */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === DARK ? LIGHT : DARK));

  return { theme, isDark: theme === DARK, toggleTheme };
};

export default useTheme;
