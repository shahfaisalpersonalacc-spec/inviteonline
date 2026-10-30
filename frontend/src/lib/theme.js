"use client";

import { useSyncExternalStore } from "react";

// The theme lives on <html class="dark">, first set before paint by the script in app/layout.js.
const root = () => document.documentElement;
const subscribe = (onChange) => {
  const mo = new MutationObserver(onChange);
  mo.observe(root(), { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};
const isDark = () => root().classList.contains("dark");

// true while the site is in dark mode (false on the server and the first render)
export const useDarkMode = () => useSyncExternalStore(subscribe, isDark, () => false);
