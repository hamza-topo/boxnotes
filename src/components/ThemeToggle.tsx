import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="themeToggle" onClick={toggleTheme}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}