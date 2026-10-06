import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const initial = window.localStorage.getItem("ascend-theme") === "dark";
    setDark(initial);
    document.documentElement.classList.toggle("theme-dark", initial);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("theme-dark", next);
    window.localStorage.setItem("ascend-theme", next ? "dark" : "light");
  };
  return <button type="button" onClick={toggle} aria-label={dark ? "Ativar modo claro" : "Ativar modo noturno"} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-[rgba(76,130,247,0.1)]">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>;
};

export default ThemeToggle;
