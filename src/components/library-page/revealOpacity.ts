/** Distance over which the end message fades in, in pixels. */
export const REVEAL_DISTANCE_PX = 120;

/**
 * Computes the end message opacity from its viewport position: 0 while it is
 * still below the fold, ramping to 1 once the user has scrolled it into view.
 * @param top Distance from the top of the viewport to the message, in pixels.
 * @param viewportHeight Height of the viewport, in pixels.
 * @param distance Fade-in distance, in pixels.
 * @returns An opacity between 0 and 1.
 */
export function revealOpacity(
  top: number,
  viewportHeight: number,
  distance: number = REVEAL_DISTANCE_PX,
): number {
  const visible = viewportHeight - top;
  return Math.min(Math.max(visible / distance, 0), 1);
}
