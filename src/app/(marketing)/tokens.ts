/** Design tokens for the marketing site (landing, about, terms, privacy).
 *  Deliberately separate from the app's own theme in globals.css — the
 *  marketing site has its own warm-cream identity per the design handoff. */
export const mkt = {
  bg: 'oklch(0.975 0.012 75)',
  cardBg: 'oklch(1 0 0)',
  textPrimary: 'oklch(0.19 0.008 60)',
  textSecondary: 'oklch(0.47 0.008 60)',
  textMuted: 'oklch(0.62 0.008 60)',
  border: 'oklch(0.9 0.01 70)',
  accentSeeker: 'oklch(0.72 0.13 85)',
  accentReferral: 'oklch(0.72 0.01 260)',
} as const;
