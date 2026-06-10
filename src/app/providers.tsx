"use client";

import { ThemeProvider } from "@jaostudio/core/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
