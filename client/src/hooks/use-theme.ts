import { useEffect, useState } from "react";

const THEME_LINK_ID = "theme-link";
const LIGHT_THEME =
  "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css";
const DARK_THEME =
  "https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css";

export function useTheme() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const themeLink = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
    if (themeLink) {
      themeLink.href = darkMode ? DARK_THEME : LIGHT_THEME;
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return { darkMode, setDarkMode, toggleTheme };
}
