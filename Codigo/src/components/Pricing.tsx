import { Magnetic, TiltCard } from "@/components/motion";

// Preços "a partir de" — placeholders. Ajuste livremente.
// `monthly`: custo recorrente (hospedagem/manutenção), separado do valor do projeto.
type Plan = {
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  monthly: string;
  featured: boolean;
  popular?: boolean;
  features: { text: string; included: boolean; bold?: boolean }[];
  btnStyle: "solid" | "outline" | "ghost";
  btnLabel: string;
};

const plans: Plan[] = [
  {
    name: "Automação",
    tagline: "Pra tirar um processo repetitivo das costas do seu time",
    price: "R$ 900",
    priceNote: "a partir de",
    monthly: "+ R$ 129,90/mês de hospedagem e manutenção",
    featured: false,
    features: [
      { text: "1 processo automatizado ponta a ponta", included: true, bold: true },
      { text: "Integração entre suas ferramentas (CRM, planilha, WhatsApp…)", included: true },
      { text: "Gatilhos, notificações e tratamento de erro", included: true },
      { text: "Documentação do fluxo", included: true },
      { text: "15 dias de ajustes incluídos", included: true },
      { text: "Painel de KPIs", included: false },
      { text: "Site", included: false },
    ],
    btnStyle: "outline",
    btnLabel: "Quero automatizar",
  },
  {
    name: "Dashboard de KPIs",
    tagline: "Pra parar de fechar planilha na mão toda semana",
    price: "R$ 1.200",
    priceNote: "a partir de",
    monthly: "+ R$ 159,90/mês de hospedagem e manutenção",
    featured: true,
    popular: true,
    features: [
      { text: "Painel com os indicadores que importam pra você", included: true, bold: true },
      { text: "Conexão às suas fontes (planilhas, gateway, CRM, banco)", included: true, bold: true },
      { text: "Atualização automática — sem exportar nada", included: true, bold: true },
      { text: "Visões por período, filtro e comparação", included: true },
      { text: "Acesso por link, sem instalar nada", included: true },
      { text: "1 automação de coleta incluída", included: true },
    ],
    btnStyle: "solid",
    btnLabel: "Quero meu painel ✦",
  },
  {
    name: "Operação completa",
    tagline: "Site sob medida + automações + painel, com acompanhamento",
    price: "Sob consulta",
    priceNote: "projeto",
    monthly: "Hospedagem e manutenção também sob consulta",
    featured: false,
    features: [
      { text: "Site institucional / landing (ou site sob medida) com captura de leads", included: true, bold: true },
      { text: "Automações do lead ao fechamento", included: true, bold: true },
      { text: "Dashboard de KPIs do funil e da operação", included: true, bold: true },
      { text: "Integrações sob medida", included: true },
      { text: "Acompanhamento mensal e evolução contínua", included: true, bold: true },
    ],
    btnStyle: "ghost",
    btnLabel: "Falar sobre o projeto",
  },
];

const Pricing = () => {
  return (
    <section id="planos" className="py-24 bg-cream2">
      <div className="container">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-orange mb-4 justify-center">
            <span className="w-5 h-0.5 bg-orange rounded-sm" aria-hidden="true" />
            Planos
          </div>
          <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink mb-4 text-center">
            Escopo fechado, <em className="not-italic text-orange">preço combinado</em>
          </h2>
          <p className="text-[15px] text-muted-custom max-w-[520px] leading-[1.7] mx-auto">
            Você paga o projeto uma vez e recebe funcionando. A manutenção mensal (hospedagem,
            monitoramento e suporte) é à parte, sem contrato de fidelidade — cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 items-start">
          {plans.map((plan) => (
            <TiltCard
              key={plan.name}
              maxDeg={5}
              className={`bg-card rounded-[20px] p-6 sm:p-8 border-2 relative transition-shadow duration-200 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] ${
                plan.featured ? "border-orange shadow-[0_8px_32px_rgba(76,130,247,0.16)]" : "border-[color:var(--sand)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange text-primary-foreground text-[10px] font-extrabold tracking-[0.1em] uppercase py-[5px] px-4 rounded-full whitespace-nowrap">
                  ★ Mais pedido
                </div>
              )}

              <div className={`font-display text-xs font-bold tracking-[0.12em] uppercase mb-1.5 ${plan.featured ? "text-orange" : "text-muted-custom"}`}>
                {plan.name}
              </div>
              <p className="text-[13px] text-muted-custom mb-6 leading-[1.5] min-h-[36px] font-light">{plan.tagline}</p>

              <div className="mb-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-custom">{plan.priceNote}</div>
                <div className={`font-mono text-4xl font-bold leading-none tracking-[-0.03em] mt-1 ${plan.featured ? "text-orange" : "text-ink"}`}>
                  {plan.price}
                </div>
                <div className="text-[12px] text-muted-custom mt-2 leading-snug">{plan.monthly}</div>
              </div>

              <div className="h-px bg-sand my-5" />

              <ul className="flex flex-col gap-2.5 mb-7 list-none">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-ink2">
                    <span className={`font-black mt-px shrink-0 ${f.included ? "text-orange" : "text-muted-custom"}`} aria-hidden="true">
                      {f.included ? "✓" : "✕"}
                    </span>
                    <span className={f.included ? "" : "text-muted-custom"}>
                      <span className="sr-only">{f.included ? "Incluído: " : "Não incluído: "}</span>
                      {f.bold ? <strong>{f.text}</strong> : f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.btnStyle === "solid" ? (
                <Magnetic className="w-full">
                  <a
                    href="#briefing"
                    className="block w-full py-3.5 rounded-full font-display text-sm font-bold text-center no-underline transition-colors duration-200 bg-orange text-primary-foreground shadow-orange hover:bg-orange2"
                  >
                    {plan.btnLabel}
                  </a>
                </Magnetic>
              ) : (
                <a
                  href="#briefing"
                  className={`block w-full py-3.5 rounded-full font-display text-sm font-bold text-center no-underline transition-all duration-200 ${
                    plan.btnStyle === "outline"
                      ? "bg-transparent border-2 border-sand text-ink hover:border-orange hover:text-orange"
                      : "bg-transparent border-2 border-sand text-ink hover:bg-orange hover:text-primary-foreground hover:border-orange"
                  }`}
                >
                  {plan.btnLabel}
                </a>
              )}
            </TiltCard>
          ))}
        </div>

        <p className="text-center text-[13px] text-muted-custom mt-8">
          Não sabe qual encaixa?{" "}
          <a
            href="https://wa.me/5511954895398?text=Ol%C3%A1!%20Quero%20ajuda%20pra%20escolher%20um%20plano%20da%20Ascend%20Digital"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange font-semibold no-underline hover:underline"
          >
            Fala comigo no WhatsApp
          </a>{" "}
          ou{" "}
          <a href="#briefing" className="text-orange font-semibold no-underline hover:underline">
            preenche o briefing
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default Pricing;
