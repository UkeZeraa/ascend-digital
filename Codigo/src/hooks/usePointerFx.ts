/**
 * Base das interações de mouse (cursor, parallax, magnético, tilt).
 * Tudo é no-op em telas de toque e quando o usuário pede menos movimento.
 */

export function canAnimate(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
