// Reusable Framer Motion presets for the entire application

export const themeTransitionPreset = {
  duration: 0.8,
  ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier matching the CSS transition
};

export const springPreset = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: themeTransitionPreset,
};
