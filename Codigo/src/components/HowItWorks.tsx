type Step = {
  icon: JSX.Element;
  title: string;
  desc: string;
};

const steps: Step[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-6 h-6">
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
        <path d="M9 4v14M15 6v14" />
      </svg>
    ),
    title: "Mapa da operação",
    desc: "A gente olha seus processos, acha os gargalos e define quais números precisam ficar na sua frente.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-6 h-6">
        <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
      </svg>
    ),
    title: "Constrói e conecta",
    desc: "Automações (n8n, Make, Zapier), integrações entre seus sistemas e o painel de KPIs — tudo ligado.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-6 h-6">
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M17 7h4v4" />
      </svg>
    ),
    title: "No ar e monitorado",
    desc: "Entra em produção com acompanhamento. Ajustamos conforme o volume cresce e o processo muda.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 bg-card">
      <div className="container">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-orange mb-4">
            <span className="w-5 h-0.5 bg-orange rounded-sm" aria-hidden="true" />
            Processo
          </div>
          <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink mb-4">
            Do caos manual à operação que <em className="not-italic text-orange">roda sozinha</em>
          </h2>
          <p className="text-[15px] text-muted-custom max-w-[520px] leading-[1.7]">
            Sem projeto de 6 meses. A primeira automação costuma ir pro ar em cerca de uma semana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 relative">
          <div className="hidden md:block absolute top-7 left-[calc(16.66%+16px)] right-[calc(16.66%+16px)] h-0.5 bg-[repeating-linear-gradient(90deg,var(--orange)_0,var(--orange)_8px,transparent_8px,transparent_16px)] opacity-30" aria-hidden="true" />
          {steps.map((step) => (
            <div key={step.title} className="text-center p-8">
              <div className="w-14 h-14 bg-orange-dim text-orange rounded-full flex items-center justify-center mx-auto mb-5 relative z-[1]">
                {step.icon}
              </div>
              <div className="font-display text-lg font-extrabold text-ink mb-2.5">{step.title}</div>
              <p className="text-sm text-muted-custom leading-[1.7]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
