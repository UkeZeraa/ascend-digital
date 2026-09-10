import { useEffect } from "react";

import { canAnimate } from "@/hooks/usePointerFx";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [data-cursor]";

/**
 * Cursor customizado: um ponto que segue o mouse na hora e um anel que
 * trilha atrás (via CSS transition). Cresce sobre elementos interativos.
 * No-op em toque / prefers-reduced-motion — o cursor nativo volta sozinho.
 * Monte uma única vez, no topo da árvore.
 */
const PointerFX = () => {
  useEffect(() => {
    if (!canAnimate()) return;

    const root = document.documentElement;
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.append(dot, ring);
    root.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      root.style.setProperty("--cursor-x", `${e.clientX}px`);
      root.style.setProperty("--cursor-y", `${e.clientY}px`);
    };
    const onOver = (e: Event) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) root.classList.add("cursor-hot");
    };
    const onOut = (e: Event) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) root.classList.remove("cursor-hot");
    };
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");
    const onLeaveWindow = () => root.classList.add("cursor-hidden");
    const onEnterWindow = () => root.classList.remove("cursor-hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      dot.remove();
      ring.remove();
      root.classList.remove("has-custom-cursor", "cursor-hot", "cursor-down", "cursor-hidden");
    };
  }, []);

  return null;
};

export default PointerFX;
