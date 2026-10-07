import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "O que está incluído no site de R$450?",
    answer: "Uma landing page de uma página, com até cinco seções, adaptação para celular, botão de WhatsApp, SEO básico, publicação e uma rodada de ajustes.",
  },
  {
    question: "Por que existe uma mensalidade?",
    answer: "A mensalidade de R$79,90 cobre hospedagem, manutenção preventiva, monitoramento básico e pequenas correções para o site continuar disponível e seguro.",
  },
  {
    question: "Quanto tempo leva para colocar o site no ar?",
    answer: "Depois de receber os materiais e as informações do briefing, a primeira versão costuma ficar pronta em até 7 dias úteis. O prazo pode variar conforme o escopo e a velocidade dos retornos.",
  },
  {
    question: "Preciso contratar domínio e hospedagem por fora?",
    answer: "Não é necessário. A Ascend pode orientar ou cuidar da publicação. O domínio é registrado no nome do cliente e qualquer custo externo é informado antes da contratação.",
  },
  {
    question: "Posso começar sem saber qual plano escolher?",
    answer: "Sim. Envie o briefing com o que você precisa resolver. A recomendação é feita com base no seu objetivo, sem obrigação de contratar.",
  },
];

const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="duvidas" className="py-24 bg-card">
      <div className="container max-w-[860px]">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-orange mb-4">
            <span className="w-5 h-0.5 bg-orange rounded-sm" aria-hidden="true" />
            Dúvidas frequentes
          </div>
          <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink mb-4">
            Tudo claro antes de começar
          </h2>
          <p className="text-[15px] text-muted-custom leading-[1.7] max-w-[560px] mx-auto">
            As respostas mais importantes sobre escopo, prazo e mensalidade.
          </p>
        </div>

        <div className="border-t border-sand">
          {FAQS.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.question} className="border-b border-sand">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left text-ink font-display font-bold text-base bg-transparent border-0 cursor-pointer"
                >
                  {item.question}
                  <ChevronDown className={`w-5 h-5 shrink-0 text-orange transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {isOpen && <p className="text-sm text-muted-custom leading-[1.7] pb-5 pr-10">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
