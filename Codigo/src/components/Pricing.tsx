import { Magnetic, TiltCard } from "@/components/motion";
import { trackEvent } from "@/lib/analytics";

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
    name: "Site Essencial",
    tagline: "O primeiro passo profissional para apresentar seu negócio.",
    price: "R$ 450",
    priceNote: "projeto",
    monthly: "+ R$ 79,90/mês para hospedagem e manutenção",
    featured: true,
    popular: true,
    features: [
      { text: "Landing page de uma página", included: true, bold: true },
      { text: "Até 5 seções organizadas", included: true },
      { text: "Layout adaptado para celular", included: true },
      { text: "Botão de WhatsApp e chamada para ação", included: true },
      { text: "SEO básico e publicação do site", included: true },
      { text: "1 rodada de ajustes após a entrega", included: true },
      { text: "Loja virtual, login e integrações complexas", included: false },
    ],
    btnStyle: "solid",
    btnLabel: "Quero meu site",
  },
  {
    name: "Automação",
    tagline: "Menos tarefa repetitiva, mais tempo para a operação.",
    price: "R$ 900",
    priceNote: "a partir de",
    monthly: "+ R$ 129,90/mês para hospedagem e manutenção",
    featured: false,
    features: [
      { text: "1 processo automatizado ponta a ponta", included: true, bold: true },
      { text: "Integração entre ferramentas do negócio", included: true },
      { text: "Gatilhos, notificações e tratamento de erros", included: true },
      { text: "Documentação do fluxo entregue", included: true },
      { text: "15 dias de ajustes incluídos", included: true },
      { text: "Dashboard de indicadores", included: false },
    ],
    btnStyle: "outline",
    btnLabel: "Quero automatizar",
  },
  {
    name: "Dashboard de KPIs",
    tagline: "Indicadores importantes em um painel simples de acompanhar.",
    price: "R$ 1.200",
    priceNote: "a partir de",
    monthly: "+ R$ 159,90/mês para hospedagem e manutenção",
    featured: false,
    features: [
      { text: "Painel com os indicadores do negócio", included: true, bold: true },
      { text: "Conexão com planilhas, CRM ou banco de dados", included: true },
      { text: "Atualização automática dos dados", included: true },
      { text: "Filtros por período e comparação", included: true },
      { text: "Acesso por link, sem instalar nada", included: true },
      { text: "1 automação de coleta incluída", included: true },
    ],
    btnStyle: "outline",
    btnLabel: "Quero meu painel",
  },
];

const whatsappForPlan = (plan: string) =>
  `https://wa.me/5511925779432?text=${encodeURIComponent(`Olá! Quero conversar sobre o plano ${plan} da Ascend Digital.`)}`;

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
            Escolha o próximo passo do seu negócio
          </h2>
          <p className="text-[15px] text-muted-custom max-w-[560px] leading-[1.7] mx-auto">
            Você paga o projeto uma vez. Hospedagem e manutenção ficam separadas em uma mensalidade clara, sem fidelidade e com cancelamento quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 items-stretch max-w-[1120px] mx-auto">
          {plans.map((plan) => (
            <TiltCard
              key={plan.name}
              maxDeg={5}
              className={`bg-card rounded-[20px] p-6 sm:p-8 border-2 relative transition-shadow duration-200 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] flex flex-col ${
                plan.featured ? "border-orange shadow-[0_8px_32px_rgba(76,130,247,0.16)]" : "border-[color:var(--sand)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange text-primary-foreground text-[10px] font-extrabold tracking-[0.1em] uppercase py-[5px] px-4 rounded-full whitespace-nowrap">
                  Mais escolhido
                </div>
              )}

              <div className={`font-display text-xs font-bold tracking-[0.12em] uppercase mb-1.5 ${plan.featured ? "text-orange" : "text-muted-custom"}`}>
                {plan.name}
              </div>
              <p className="text-[13px] text-muted-custom mb-6 leading-[1.5] min-h-[40px] font-light">{plan.tagline}</p>

              <div className="mb-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-custom">{plan.priceNote}</div>
                <div className={`font-mono text-4xl font-bold leading-none tracking-[-0.03em] mt-1 ${plan.featured ? "text-orange" : "text-ink"}`}>
                  {plan.price}
                </div>
                <div className="text-[12px] text-muted-custom mt-2 leading-snug">{plan.monthly}</div>
              </div>

              <div className="h-px bg-sand my-5" />

              <ul className="flex flex-col gap-2.5 mb-7 list-none flex-1">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-ink2">
                    <span className={`font-black mt-px shrink-0 ${feature.included ? "text-orange" : "text-muted-custom"}`} aria-hidden="true">
                      {feature.included ? "✓" : "×"}
                    </span>
                    <span className={feature.included ? "" : "text-muted-custom"}>
                      <span className="sr-only">{feature.included ? "Incluído: " : "Não incluído: "}</span>
                      {feature.bold ? <strong>{feature.text}</strong> : feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.btnStyle === "solid" ? (
                <Magnetic className="w-full">
                  <a href="#briefing" onClick={() => trackEvent("plan_click", { plan: plan.name })} className="block w-full py-3.5 rounded-full font-display text-sm font-bold text-center no-underline transition-colors duration-200 bg-orange text-primary-foreground shadow-orange hover:bg-orange2">
                    {plan.btnLabel}
                  </a>
                </Magnetic>
              ) : (
                <a href="#briefing" onClick={() => trackEvent("plan_click", { plan: plan.name })} className="block w-full py-3.5 rounded-full font-display text-sm font-bold text-center no-underline transition-all duration-200 bg-transparent border-2 border-sand text-ink hover:border-orange hover:text-orange">
                  {plan.btnLabel}
                </a>
              )}
              <a href={whatsappForPlan(plan.name)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { placement: "plan_card", plan: plan.name })} className="mt-3 text-center text-xs font-semibold text-orange no-underline hover:underline">
                Tirar dúvida no WhatsApp
              </a>
            </TiltCard>
          ))}
        </div>

        <p className="text-center text-[13px] text-muted-custom mt-8">
          Ainda está em dúvida?{" "}
          <a href="https://wa.me/5511925779432?text=Ol%C3%A1!%20Quero%20ajuda%20pra%20escolher%20um%20plano%20da%20Ascend%20Digital" target="_blank" rel="noopener noreferrer" className="text-orange font-semibold no-underline hover:underline">
            Fale com a Ascend no WhatsApp
          </a>
          {" "}ou{" "}
          <a href="#briefing" className="text-orange font-semibold no-underline hover:underline">preencha o briefing</a>.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
