"use client";

import { useEffect, useState } from "react";

type Options = {
  end: number;
  duration?: number;
  enabled?: boolean;
  decimals?: number;
};

export function useCountUp({ end, duration = 1200, enabled = true, decimals = 0 }: Options) {
  const [value, setValue] = useState(enabled ? 0 : end);

  useEffect(() => {
    if (!enabled) {
      setValue(end);
      return;
    }

    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);
      const current = parseFloat((progress * end).toFixed(decimals));

      setValue(current);

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [end, duration, enabled, decimals]);

  return value;
}
