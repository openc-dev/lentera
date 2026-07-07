"use client";

import { useEffect } from "react";

export function ThemeInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "light-mode") {
      document.documentElement.setAttribute("data-theme", "light-mode");
    } else {
      document.documentElement.setAttribute("data-theme", "dark-mode");
    }
  }, []);

  return <>{children}</>;
}
