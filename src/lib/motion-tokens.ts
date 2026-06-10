export const durations = {
  fast:   0.15,
  normal: 0.3,
  slow:   0.5,
  xl:     0.8,
  hero:   1.2,
} as const;

export const easing = {
  out:      [0.16, 1, 0.3, 1] as const,
  spring:   [0.34, 1.56, 0.64, 1] as const,
  emphasis: [0.25, 0.46, 0.45, 0.94] as const,
  linear:   [0, 0, 1, 1] as const,
};

export const staggers = {
  fast:   0.04,
  normal: 0.08,
  slow:   0.12,
} as const;

export const springs = {
  gentle:  { stiffness: 200, damping: 25 } as const,
  snappy:  { stiffness: 400, damping: 20 } as const,
  default: { stiffness: 300, damping: 30 } as const,
};

export const fadeUpBlur = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const statItem = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export const transitions = {
  fast:      { duration: durations.fast, ease: easing.out } as const,
  hero:      { duration: durations.hero * 0.5, ease: easing.out } as const,
  normal:    { duration: durations.normal, ease: easing.out } as const,
  slow:      { duration: durations.slow, ease: easing.out } as const,
  springIn:  { duration: durations.normal, ease: easing.spring } as const,
  springOut: { duration: durations.fast, ease: easing.spring } as const,
};

export const reducedMotionOverrides = {
  fadeUpBlur: { hidden: { opacity: 1, y: 0, filter: "blur(0px)" } },
  fadeUp:     { hidden: { opacity: 1, y: 0 } },
  statItem:   { hidden: { opacity: 1, y: 0, scale: 1 } },
} as const;
