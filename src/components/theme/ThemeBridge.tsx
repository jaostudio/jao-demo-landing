import { resolveTheme, type Theme } from "@jaostudio/engine/theme";
import type { ReactNode } from "react";

type Props = {
  theme: Theme;
  children: ReactNode;
};

export function ThemeBridge({ theme, children }: Props) {
  const t = resolveTheme(theme);

  const style = {
    "--theme-primary": t.primary[500],
    "--theme-primary-600": t.primary[600],
    "--theme-accent": t.accent[500],
    "--theme-accent-600": t.accent[600],
  } as React.CSSProperties;

  return <div style={style}>{children}</div>;
}
