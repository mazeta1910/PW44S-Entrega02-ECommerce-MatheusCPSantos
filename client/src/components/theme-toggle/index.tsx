import { Button } from "primereact/button";
import { useTheme } from "@/hooks/use-theme";
import "./styles.css";

export function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      icon={darkMode ? "pi pi-sun" : "pi pi-moon"}
      className="theme-toggle"
      rounded
      text
      aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
      tooltip={darkMode ? "Modo claro" : "Modo escuro"}
      tooltipOptions={{ position: "left" }}
      onClick={toggleTheme}
    />
  );
}
