import { useEffect, useRef } from "react";

import { Magnetic } from "@/components/motion";
import { canAnimate } from "@/hooks/usePointerFx";

const stats = [
  { num: "+40", suffix: "h/mês", label: "de trabalho manual eliminado" },
  { num: "24", suffix: "/7", label: "rodando sem você tocar" },
  { num: "~1", suffix: "sem", label: "pro primeiro fluxo no ar" },
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !canAnimate()) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });
    };
    const reset = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-screen bg-ink dot-grid flex items-center pt-[68px] relative overflow-hidden"
      style={{ "--px": 0, "--py": 0 } as React.CSSProperties}
    >
      <div
        data-parallax
        className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(76,130,247,0.16)_0%,transparent_70%)] -top-[200px] -right-[200px] pointer-events-none transition-transform duration-300 ease-out"
        style={{ transform: "translate(calc(var(--px) * 40px), calc(var(--py) * 40px))" }}
        aria-hidden="true"
      />
      <div
        data-parallax
        className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,195,166,0.1)_0%,transparent_70%)] -bottom-[100px] left-[100px] pointer-events-none transition-transform duration-300 ease-out"
        style={{ transform: "translate(calc(var(--px) * -24px), calc(var(--py) * -24px))" }}
        aria-hidden="true"
      />

      <div className="container">
        <div className="max-w-[760px] py-20">
          <div className="inline-flex items-center gap-2 bg-[rgba(76,130,247,0.12)] border border-[rgba(76,130,247,0.25)] text-orange text-[11px] font-bold tracking-[0.12em] uppercase py-1.5 px-3.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse-dot" aria-hidden="true" />
            Automação · KPIs · Sites
          </div>

          <h1 className="font-display text-[clamp(36px,5.5vw,62px)] font-black leading-[1.05] tracking-[-0.03em] text-ink mb-5">
            Menos trabalho manual.<br />
            <em className="not-italic text-orange">Mais resultado</em><br />
            <span className="block text-muted-custom font-light text-[0.72em]">medido em tempo real.</span>
          </h1>

          <p className="text-base text-ink2 leading-[1.7] mb-9 max-w-[480px]">
            Eu automatizo os processos que consomem seu time, monto o painel que mostra seus
            números e construo o site que sustenta tudo — sem você virar refém de planilha.
          </p>

          <div className="flex gap-3 flex-wrap mb-12">
            <Magnetic>
              <a
                href="/briefing.html"
                className="inline-flex items-center gap-2 bg-orange text-primary-foreground font-display text-[15px] font-bold py-3.5 px-7 rounded-full no-underline transition-colors duration-200 shadow-orange hover:bg-orange2"
              >
                Quero automatizar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </Magnetic>
            <a
              href="/portfolio.html"
              className="inline-flex items-center gap-2 bg-transparent text-ink2 text-[15px] font-medium py-3.5 px-6 rounded-full border border-[rgba(255,255,255,0.15)] no-underline transition-all duration-200 hover:border-[rgba(76,130,247,0.5)] hover:text-orange"
            >
              Ver casos
            </a>
          </div>

          <div className="flex gap-8 flex-wrap">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-[28px] font-bold tracking-[-0.02em] text-ink">
                  {stat.num}
                  <span className="text-orange">{stat.suffix}</span>
                </div>
                <div className="text-xs text-muted-custom mt-0.5 max-w-[160px] leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
