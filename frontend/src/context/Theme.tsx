import React, { createContext, useContext, useState, useEffect } from "react";
interface ThemeContextType {
  theme: string;
  changeTheme: () => void;
}
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Применяем класс темы к корневому элементу
    if (theme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
  }, [theme]);

  function changeTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  }

  const value = { theme, changeTheme };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
