"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/lib/theme";

const root = () => document.documentElement;

// Sun / moon button. Tapping it saves the choice on this device; until then the theme follows the device.
export default function ThemeToggle({ className = "" }) {
  const dark = useDarkMode();

  // no saved choice yet: keep following the device when its setting changes
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const follow = (e) => {
      try {
        if (localStorage.getItem("theme")) return;
      } catch {}
      root().classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, []);

  const toggle = () => {
    root().classList.toggle("dark", !dark);
    try {
      localStorage.setItem("theme", dark ? "light" : "dark");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`at-glass grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-500 transition hover:text-ink ${className}`}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? <Sun className="h-[18px] w-[18px] text-gold-600" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
