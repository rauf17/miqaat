// Reusable Framer Motion presets for the entire application.
//
// THM-013: removed dead `springPreset` and `fadeIn` exports (grep
// confirmed zero importers). Keeping them around invited copy-paste
// of presets that don't honor reduced-motion.

export const themeTransitionPreset = {
  duration: 0.8,
  ease: [0.4, 0, 0.2, 1] as const,
};
