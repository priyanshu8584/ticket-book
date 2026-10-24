"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ticketr-theme");
    const root = document.documentElement;
    if (saved === "light") {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      root.classList.add("dark");
      localStorage.setItem("ticketr-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("ticketr-theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle Dark Mode"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100/80 text-slate-700 transition-all duration-150 hover:border-blue-500/40 hover:bg-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:text-amber-300 dark:hover:border-blue-500/50 dark:hover:bg-slate-800"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
