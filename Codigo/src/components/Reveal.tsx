import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso do fade-in, em ms (stagger opcional). */
  delay?: number;
  /** Mostra o "wipe" fino de cor acima do bloco quando ele entra em cena. */
  divider?: boolean;
};

/**
 * Envolve uma seção e a revela (fade + leve subida) quando ela entra no viewport.
 * A animação em si vive no `.reveal` / `.section-wipe` do index.css e é neutralizada
 * por `@media (prefers-reduced-motion: reduce)` — aqui só alternamos a classe `visible`.
 */
const Reveal = ({ children, delay = 0, divider = false }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal" style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>
      {divider && <span className="section-wipe" aria-hidden="true" />}
      {children}
    </div>
  );
};

export default Reveal;
