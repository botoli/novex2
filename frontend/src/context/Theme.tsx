import React, { createContext, useContext, useState, useEffect } from 'react';
interface ThemeContextType {
  theme: string;
  changeTheme: () => void;
}
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  function changeTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  const value = { theme, changeTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
