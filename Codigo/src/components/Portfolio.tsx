import { TiltCard } from "@/components/motion";

type IconName = "flow" | "chart" | "spark" | "window" | "calendar" | "ledger";

type CaseItem = {
  category: "Automação" | "Dashboard" | "Site";
  title: string;
  result: string;
  stack: string;
  tone: "lime" | "emerald";
  icon: IconName;
};

// Ícones de linha geométrica (sem emoji). stroke = currentColor, herda a cor do tile.
const ICONS: Record<IconName, JSX.Element> = {
  flow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-9 h-9">
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M7 6h10M6.5 8l4.2 8M17.5 8l-4.2 8" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-9 h-9">
      <path d="M4 4v16h16" />
      <rect x="7" y="12" width="3" height="5" />
      <rect x="12.5" y="8" width="3" height="9" />
      <rect x="18" y="5" width="3" height="12" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-9 h-9">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M16 7h5v5" />
      <circle cx="9" cy="11" r="1.4" />
      <circle cx="13" cy="15" r="1.4" />
    </svg>
  ),
  window: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-9 h-9">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6.5" cy="6.5" r="0.6" />
      <circle cx="9" cy="6.5" r="0.6" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-9 h-9">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M7.5 14h3M13.5 14h3M7.5 17.5h3" />
    </svg>
  ),
  ledger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-9 h-9">
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 12h6M9 15.5h6M9 19h4" />
    </svg>
  ),
};

// Casos ilustrativos — mostram tipos de entrega, não clientes reais.
const cases: CaseItem[] = [
  {
    category: "Automação",
    title: "Fluxo de propostas automático",
    result: "Lead entra no formulário → cai no CRM → proposta gerada e enviada no WhatsApp em segundos.",
    stack: "n8n · CRM · WhatsApp API",
    tone: "lime",
    icon: "flow",
  },
  {
    category: "Dashboard",
    title: "Painel de vendas em tempo real",
    result: "Planilhas, gateway e CRM consolidados num só painel que atualiza sozinho.",
    stack: "Supabase · API do gateway · gráficos",
    tone: "emerald",
    icon: "chart",
  },
  {
    category: "Automação",
    title: "Onboarding de clientes sem e-mail manual",
    result: "Contrato assinado dispara acessos, pasta, mensagem de boas-vindas e tarefa pro time.",
    stack: "Make · assinatura digital · Slack",
    tone: "lime",
    icon: "spark",
  },
  {
    category: "Site",
    title: "Landing + captura + CRM",
    result: "Site rápido, formulário que valida e joga o lead direto no funil, com rastreamento.",
    stack: "Vite · Supabase · pixel/analytics",
    tone: "emerald",
    icon: "window",
  },
  {
    category: "Automação",
    title: "Relatório semanal que se monta sozinho",
    result: "Toda segunda 8h, os números da semana chegam formatados no e-mail e no grupo.",
    stack: "n8n · Google Sheets · e-mail",
    tone: "lime",
    icon: "calendar",
  },
  {
    category: "Automação",
    title: "Conciliação financeira",
    result: "Cruza extrato, gateway e notas; separa o que bateu do que precisa de olho humano.",
    stack: "Python/Edge Function · planilhas",
    tone: "emerald",
    icon: "ledger",
  },
];

const Portfolio = () => {
  return (
    <section id="casos" className="py-24 bg-cream2">
      <div className="container">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-orange mb-4">
          <span className="w-5 h-0.5 bg-orange rounded-sm" aria-hidden="true" />
          Casos
        </div>
        <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          O tipo de coisa que a gente <em className="not-italic text-orange">tira do seu caminho</em>
        </h2>
        <p className="text-[15px] text-muted-custom max-w-[520px] leading-[1.7]">
          Exemplos de entregas reais de automação, dashboard e site. O seu é montado sob medida.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {cases.map((c) => (
            <TiltCard
              key={c.title}
              maxDeg={6}
              className="bg-card rounded-[20px] overflow-hidden border border-[color:var(--sand)] shadow-[0_2px_16px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
            >
              <div
                className={`h-32 flex items-center justify-center border-b border-[color:var(--sand)] bg-gradient-to-br from-[#14171C] ${
                  c.tone === "lime" ? "to-[#111a2b]" : "to-[#0f2420]"
                }`}
                aria-hidden="true"
              >
                <span className={c.tone === "lime" ? "text-orange" : "text-emerald"}>{ICONS[c.icon]}</span>
              </div>
              <div className="p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-orange mb-1.5">{c.category}</div>
                <h3 className="font-display text-[15px] font-extrabold text-ink mb-2 leading-snug">{c.title}</h3>
                <p className="text-[13px] text-muted-custom leading-[1.6] mb-3">{c.result}</p>
                <p className="font-mono text-[11px] text-ink2/70">{c.stack}</p>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/portfolio.html"
            className="inline-flex items-center gap-2 bg-orange text-primary-foreground font-display text-sm font-bold py-3 px-7 rounded-full no-underline transition-colors duration-200 shadow-orange hover:bg-orange2"
          >
            Ver todos os casos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
