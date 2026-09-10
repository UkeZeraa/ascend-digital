import { useEffect, useRef } from "react";

import { canAnimate, clamp } from "@/hooks/usePointerFx";

/**
 * Puxa o elemento na direção do cursor quando ele passa por cima,
 * com retorno suave ao sair. Aplique num wrapper, não no botão em si,
 * para não conflitar com transforms de :hover.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, max = 14) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;

    el.style.transition = "transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)";
    el.style.willChange = "transform";

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${clamp(dx * strength, -max, max).toFixed(1)}px, ${clamp(dy * strength, -max, max).toFixed(1)}px)`;
    };
    const reset = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      el.style.transform = "";
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [strength, max]);

  return ref;
}
