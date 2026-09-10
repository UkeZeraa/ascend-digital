import { useEffect, useRef } from "react";

import { canAnimate } from "@/hooks/usePointerFx";

/**
 * Inclina o elemento em 3D seguindo a posição do cursor sobre ele.
 * Reset suave ao sair. rAF para não trabalhar a cada pointermove.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 7) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;

    el.style.transition = "transform 0.25s ease-out";
    el.style.willChange = "transform";
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(-py * maxDeg).toFixed(2)}deg) rotateY(${(px * maxDeg).toFixed(2)}deg)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      el.style.transform = "";
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [maxDeg]);

  return ref;
}
