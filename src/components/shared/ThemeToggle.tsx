"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 rounded-xl border-border/80 bg-background/50 hover:bg-accent transition-all duration-200"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 rotate-0" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform duration-200" />
      )}
    </Button>
  );
}
