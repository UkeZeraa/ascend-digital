import { ArrowUpRight, CheckCircle2, LayoutTemplate, MessageCircle, Workflow } from "lucide-react";

type Tone = "blue" | "teal" | "orange";

type CaseItem = {
  category: string;
  title: string;
  description: string;
  deliverables: string[];
  flow: string[];
  tone: Tone;
};

const cases: CaseItem[] = [
  {
    category: "Site Essencial",
    title: "Presença profissional para um negócio local",
    description: "Uma página objetiva para explicar o serviço, mostrar trabalhos e transformar visitas em conversas.",
    deliverables: ["Apresentação e serviços", "Galeria de trabalhos", "WhatsApp em destaque"],
    flow: ["Cliente encontra", "Entende a oferta", "Chama no WhatsApp"],
    tone: "blue",
  },
  {
    category: "Site Institucional",
    title: "Serviços organizados para gerar confiança",
    description: "Até quatro páginas para negócios que precisam explicar melhor sua atuação, diferenciais e forma de atendimento.",
    deliverables: ["Até quatro páginas", "Conteúdo organizado", "Uma rodada de ajustes"],
    flow: ["Contexto", "Prova", "Orçamento"],
    tone: "teal",
  },
  {
    category: "Evolução",
    title: "Site conectado à operação",
    description: "Quando o negócio cresce, o site pode receber briefing, integrações e automações sob medida.",
    deliverables: ["Formulário qualificado", "Integração com ferramentas", "Dashboard sob orçamento"],
    flow: ["Captura", "Organização", "Acompanhamento"],
    tone: "orange",
  },
];

const toneClasses: Record<Tone, string> = {
  blue: "bg-[linear-gradient(135deg,#EFF6FF,#DBEAFE)] text-[#2563EB]",
  teal: "bg-[linear-gradient(135deg,#ECFDF5,#CCFBF1)] text-[#0F766E]",
  orange: "bg-[linear-gradient(135deg,#FFF7ED,#FFEDD5)] text-[#C2410C]",
};

const CaseIcon = ({ tone }: { tone: Tone }) => {
  if (tone === "teal") return <Workflow className="h-8 w-8" aria-hidden="true" />;
  if (tone === "orange") return <MessageCircle className="h-8 w-8" aria-hidden="true" />;
  return <LayoutTemplate className="h-8 w-8" aria-hidden="true" />;
};

const Portfolio = () => (
  <section id="casos" className="bg-cream2 py-24">
    <div className="container">
      <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
        <span className="h-0.5 w-5 rounded-sm bg-orange" aria-hidden="true" />
        Demonstrações
      </div>
      <h2 className="mb-4 max-w-[700px] font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
        Sites pensados para <em className="not-italic text-orange">serem escolhidos</em>
      </h2>
      <p className="max-w-[620px] text-[15px] leading-[1.7] text-muted-custom">
        Veja como uma necessidade comum vira uma experiência clara, bonita e pronta para gerar contato. São demonstrações de escopo, não clientes reais.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {cases.map((item, index) => (
          <article key={item.title} className={`group overflow-hidden rounded-[24px] border border-[color:var(--sand)] bg-card shadow-[0_8px_30px_rgba(16,24,40,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(16,24,40,0.12)] ${index === 0 ? "lg:col-span-2" : ""}`}>
            <div className={`flex min-h-[156px] items-start justify-between p-6 ${toneClasses[item.tone]}`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-sm"><CaseIcon tone={item.tone} /></div>
              <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]">{item.category}</span>
            </div>
            <div className="p-6 sm:p-7">
              <h3 className="font-display text-xl font-extrabold leading-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-custom">{item.description}</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {item.deliverables.map((deliverable) => <div key={deliverable} className="flex items-start gap-2 text-xs font-semibold text-ink2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange" />{deliverable}</div>)}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-sand pt-5">
                {item.flow.map((step, stepIndex) => <span key={step} className="rounded-full bg-cream2 px-3 py-1.5 text-xs font-semibold text-muted-custom">{stepIndex + 1}. {step}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a href="#briefing" className="inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3 font-display text-sm font-bold text-primary-foreground no-underline shadow-orange transition-colors hover:bg-orange2">
          Quero uma demonstração para meu negócio
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
);

export default Portfolio;
