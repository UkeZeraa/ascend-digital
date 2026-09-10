import { useId, useState } from "react";

import { PROJECT_TYPES, DEADLINES, PLANS } from "@/lib/briefing-options";
import { validateBriefing } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

type FormState = {
  name: string;
  whatsapp: string;
  email: string;
  business_name: string;
  project_type: string;
  deadline: string;
  plan: string;
  current_tools: string;
  kpis: string;
  description: string;
  company_website: string; // honeypot
};

const EMPTY: FormState = {
  name: "",
  whatsapp: "",
  email: "",
  business_name: "",
  project_type: "",
  deadline: "",
  plan: "",
  current_tools: "",
  kpis: "",
  description: "",
  company_website: "",
};

const BriefingForm = () => {
  const uid = useId();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.company_website.trim()) {
      setSubmitted(true);
      return;
    }

    const { valid, errors: fieldErrors } = validateBriefing(form);
    if (!valid) {
      setErrors(fieldErrors);
      toast({ title: "Confira os campos", description: "Alguns campos precisam de ajuste.", variant: "destructive" });
      return;
    }
    setErrors({});

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      toast({
        title: "Configuração ausente",
        description: "O formulário está indisponível no momento. Fale pelo WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-briefing`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
        body: JSON.stringify({
          name: form.name.trim(),
          whatsapp: form.whatsapp.trim(),
          email: form.email.trim(),
          business_name: form.business_name.trim(),
          project_type: form.project_type,
          deadline: form.deadline || null,
          plan: form.plan || null,
          current_tools: form.current_tools.trim() || null,
          kpis: form.kpis.trim() || null,
          description: form.description.trim() || null,
          company_website: "",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error || "Não foi possível enviar agora.");

      setSubmitted(true);
    } catch (err) {
      toast({
        title: "Erro ao enviar",
        description:
          err instanceof Error
            ? `${err.message} Tente de novo ou fale pelo WhatsApp.`
            : "Falha de conexão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[rgba(255,255,255,0.06)] border rounded-xl text-ink font-body text-sm py-3 px-4 outline-none transition-all focus:border-orange focus:bg-[rgba(76,130,247,0.06)] placeholder:text-[rgba(255,255,255,0.25)]";
  const borderFor = (field: string) => (errors[field] ? "border-[#FF6B6B]" : "border-[rgba(255,255,255,0.1)]");
  const labelClass = "block text-xs font-semibold text-[rgba(255,255,255,0.6)] tracking-[0.06em] uppercase mb-2";

  const fieldError = (field: string) =>
    errors[field] ? (
      <p id={`${uid}-${field}-err`} className="mt-1.5 text-[11px] text-[#FFB4B4]">
        {errors[field]}
      </p>
    ) : null;

  const aria = (field: string) =>
    errors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `${uid}-${field}-err` }
      : {};

  return (
    <section id="briefing" className="py-24 bg-ink dot-grid relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(76,130,247,0.1)_0%,transparent_70%)] -top-[200px] -right-[200px] pointer-events-none" aria-hidden="true" />

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-orange mb-4">
              <span className="w-5 h-0.5 bg-orange rounded-sm" aria-hidden="true" />
              Briefing
            </div>
            <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink mb-4">
              Conta o que<br />
              <em className="not-italic text-orange">está te travando</em>
            </h2>
            <p className="text-[15px] text-[rgba(255,255,255,0.45)] max-w-[520px] leading-[1.7]">
              Preenche ao lado e eu retorno em até 2 horas pelo WhatsApp com um diagnóstico rápido e os próximos passos.
            </p>

            <div className="flex flex-col gap-4 mt-9">
              {[
                { icon: "⚡", title: "Resposta em até 2 horas", desc: "Nos dias úteis, confirmo o recebimento rapidinho." },
                { icon: "🎯", title: "Escopo e preço claros", desc: "Antes de começar, você sabe o que entra e quanto custa." },
                { icon: "🔁", title: "Ajustes inclusos", desc: "Todo projeto tem período de ajuste após a entrega." },
              ].map((p) => (
                <div key={p.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[rgba(76,130,247,0.12)] rounded-[10px] flex items-center justify-center text-base shrink-0" aria-hidden="true">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-ink mb-0.5">{p.title}</h4>
                    <p className="text-xs text-[rgba(255,255,255,0.4)] leading-[1.5]">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 sm:p-9">
                {/* Honeypot */}
                <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
                  <label htmlFor={`${uid}-company_website`}>Não preencha</label>
                  <input id={`${uid}-company_website`} type="text" name="company_website" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor={`${uid}-name`} className={labelClass}>Seu nome *</label>
                    <input id={`${uid}-name`} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ana Lima" required className={`${inputClass} ${borderFor("name")}`} {...aria("name")} />
                    {fieldError("name")}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-whatsapp`} className={labelClass}>WhatsApp *</label>
                    <input id={`${uid}-whatsapp`} type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="(11) 99999-9999" required className={`${inputClass} ${borderFor("whatsapp")}`} {...aria("whatsapp")} />
                    {fieldError("whatsapp")}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor={`${uid}-email`} className={labelClass}>E-mail *</label>
                    <input id={`${uid}-email`} type="email" name="email" value={form.email} onChange={handleChange} placeholder="seuemail@empresa.com" required className={`${inputClass} ${borderFor("email")}`} {...aria("email")} />
                    {fieldError("email")}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-business_name`} className={labelClass}>Empresa / negócio *</label>
                    <input id={`${uid}-business_name`} type="text" name="business_name" value={form.business_name} onChange={handleChange} placeholder="Ex: Loja da Bela" required className={`${inputClass} ${borderFor("business_name")}`} {...aria("business_name")} />
                    {fieldError("business_name")}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor={`${uid}-project_type`} className={labelClass}>Tipo de projeto *</label>
                    <select id={`${uid}-project_type`} name="project_type" value={form.project_type} onChange={handleChange} required className={`${inputClass} ${borderFor("project_type")} appearance-none`} {...aria("project_type")}>
                      <option value="" disabled className="bg-[#101319]">Selecione...</option>
                      {PROJECT_TYPES.map((p) => (
                        <option key={p} value={p} className="bg-[#101319]">{p}</option>
                      ))}
                    </select>
                    {fieldError("project_type")}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-deadline`} className={labelClass}>Prazo</label>
                    <select id={`${uid}-deadline`} name="deadline" value={form.deadline} onChange={handleChange} className={`${inputClass} ${borderFor("deadline")} appearance-none`} {...aria("deadline")}>
                      <option value="" disabled className="bg-[#101319]">Quando precisa?</option>
                      {DEADLINES.map((d) => (
                        <option key={d} value={d} className="bg-[#101319]">{d}</option>
                      ))}
                    </select>
                    {fieldError("deadline")}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor={`${uid}-current_tools`} className={labelClass}>Ferramentas que você já usa</label>
                  <input id={`${uid}-current_tools`} type="text" name="current_tools" value={form.current_tools} onChange={handleChange} placeholder="Ex: Planilhas Google, Pipedrive, WhatsApp, Bling" className={`${inputClass} ${borderFor("current_tools")}`} {...aria("current_tools")} />
                  {fieldError("current_tools")}
                </div>

                <div className="mb-4">
                  <label htmlFor={`${uid}-kpis`} className={labelClass}>Números que você quer acompanhar</label>
                  <input id={`${uid}-kpis`} type="text" name="kpis" value={form.kpis} onChange={handleChange} placeholder="Ex: vendas/dia, taxa de conversão, tempo de resposta" className={`${inputClass} ${borderFor("kpis")}`} {...aria("kpis")} />
                  {fieldError("kpis")}
                </div>

                <div className="mb-4">
                  <label htmlFor={`${uid}-plan`} className={labelClass}>Plano de interesse</label>
                  <select id={`${uid}-plan`} name="plan" value={form.plan} onChange={handleChange} className={`${inputClass} ${borderFor("plan")} appearance-none`} {...aria("plan")}>
                    <option value="" disabled className="bg-[#101319]">Qual plano faz sentido?</option>
                    {PLANS.map((p) => (
                      <option key={p} value={p} className="bg-[#101319]">{p}</option>
                    ))}
                  </select>
                  {fieldError("plan")}
                </div>

                <div className="mb-4">
                  <label htmlFor={`${uid}-description`} className={labelClass}>O que precisa ser resolvido</label>
                  <textarea id={`${uid}-description`} name="description" value={form.description} onChange={handleChange} placeholder="Descreva o processo manual que trava seu time, ou o que o site/dashboard precisa fazer." className={`${inputClass} ${borderFor("description")} resize-y min-h-[90px] leading-[1.6]`} {...aria("description")} />
                  {fieldError("description")}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="w-full py-4 bg-orange text-primary-foreground font-display text-base font-bold border-none rounded-full cursor-pointer shadow-orange transition-all duration-200 hover:bg-orange2 hover:-translate-y-px mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar briefing →"}
                </button>
                <p className="text-[11px] text-[rgba(255,255,255,0.3)] text-center mt-3 italic">
                  Retorno em até 2h no WhatsApp ✦ Sem compromisso
                </p>
              </form>
            ) : (
              <div className="text-center py-16 px-5" role="status">
                <div className="text-[52px] mb-5" aria-hidden="true">🎯</div>
                <h3 className="font-display text-2xl font-extrabold text-ink mb-2.5">Briefing recebido!</h3>
                <p className="text-[rgba(255,255,255,0.45)] text-[15px] leading-[1.7]">
                  Em até 2 horas eu te chamo no WhatsApp com um diagnóstico rápido e uma proposta de escopo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BriefingForm;
