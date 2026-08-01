/**
 * Self-hosted font assets.
 *
 * troika (behind drei's <Text>) fetches Roboto from a Google CDN when no `font`
 * is supplied. Pointing it at local files keeps the 3D type on-brand, removes a
 * third-party request from the critical path and lets the site render with no
 * external network access at all.
 */
export const FONT_3D_DISPLAY = '/fonts/Inter-Black.ttf';
export const FONT_3D_BODY = '/fonts/Inter-SemiBold.ttf';

/** Preloaded by the loading screen so no 3D label pops in late. */
export const FONT_3D_ASSETS = [FONT_3D_DISPLAY, FONT_3D_BODY] as const;
