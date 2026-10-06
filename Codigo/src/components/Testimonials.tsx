import { CheckCircle2, Quote, Send, ShieldCheck, Smartphone, Target } from "lucide-react";
import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { validateTestimonial } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

type Testimonial = { id: string; name: string; role: string | null; rating: number; text: string };

const promises = [
  { icon: Smartphone, title: "Pensado para o celular", text: "O cliente encontra o essencial sem apertar, ampliar ou procurar demais." },
  { icon: Target, title: "Mensagem sem enrolação", text: "Organizamos serviços, diferenciais e contato para facilitar a decisão." },
  { icon: ShieldCheck, title: "Entrega previsível", text: "Escopo, prazo, ajustes e mensalidade ficam claros antes do início." },
];

const Testimonials = () => {
  const uid = useId();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials", "published"],
    queryFn: async (): Promise<Testimonial[]> => {
      const { data, error } = await supabase.from("testimonials").select("id,name,role,rating,text").eq("published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const submit = async () => {
    if (company.trim()) { setSuccess(true); return; }
    const result = validateTestimonial({ name, text, rating });
    if (!result.valid) { setErrors(result.errors); return; }
    setErrors({});
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
    if (!url || !key) { toast({ title: "Indisponível", description: "Tente novamente mais tarde.", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const response = await fetch(`${url}/functions/v1/submit-testimonial`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: key },
        body: JSON.stringify({ name: name.trim(), role: null, rating, text: text.trim(), company_website: "" }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error((body as { error?: string }).error || "Não foi possível enviar.");
      setSuccess(true); setName(""); setText(""); setRating(0);
    } catch (error) {
      toast({ title: "Erro ao enviar", description: error instanceof Error ? error.message : "Falha de conexão.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <section id="depoimentos" className="bg-card py-24">
      <div className="container">
        <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
          <span className="h-0.5 w-5 rounded-sm bg-orange" aria-hidden="true" />
          Confiança
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <h2 className="mb-4 max-w-[680px] font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
              Um bom site deixa o cliente mais seguro para <em className="not-italic text-orange">dar o próximo passo.</em>
            </h2>
            <p className="max-w-[620px] text-[15px] leading-[1.7] text-muted-custom">Enquanto reunimos depoimentos reais, mostramos com transparência o que orienta cada entrega.</p>
          </div>
          <div className="rounded-2xl border border-sand bg-cream2 p-5 text-sm leading-6 text-muted-custom"><Quote className="mb-3 h-6 w-6 text-orange" aria-hidden="true" />Depoimentos publicados aqui passam por revisão e autorização. Nenhuma demonstração é apresentada como cliente real.</div>
        </div>

        {testimonials.length > 0 ? (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((item) => (
              <figure key={item.id} className="rounded-2xl border border-sand bg-cream2 p-6">
                <div className="mb-4 text-amber" aria-label={`Nota ${item.rating} de 5`}>{"★".repeat(item.rating)}<span className="opacity-25">{"★".repeat(5 - item.rating)}</span></div>
                <blockquote className="text-sm leading-7 text-ink">“{item.text}”</blockquote>
                <figcaption className="mt-6 border-t border-sand pt-4 text-xs font-semibold text-muted-custom">{item.name}{item.role ? ` · ${item.role}` : ""}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {promises.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-sand bg-cream2 p-6"><Icon className="mb-5 h-7 w-7 text-orange" aria-hidden="true" /><h3 className="font-display text-lg font-extrabold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-custom">{text}</p></div>)}
          </div>
        )}

        <div className="mt-12 grid gap-8 rounded-[24px] border border-sand bg-cream2 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div><h3 className="font-display text-2xl font-extrabold text-ink">Já recebeu uma entrega?</h3><p className="mt-3 text-sm leading-6 text-muted-custom">Envie um depoimento verdadeiro. Depois da revisão e da sua autorização, ele pode aparecer aqui.</p><div className="mt-5 flex flex-col gap-2 text-xs font-semibold text-muted-custom"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald" />Publicação somente após moderação</span><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald" />Sem dados inventados</span></div></div>
          {!success ? <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor={`${uid}-name`} className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-muted-custom">Nome ou empresa</label><input id={`${uid}-name`} value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-sand bg-card px-4 py-3 text-sm text-ink outline-none focus:border-orange" />{errors.name && <p className="mt-1 text-xs text-[#DC2626]">{errors.name}</p>}</div><div><label htmlFor={`${uid}-rating`} className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-muted-custom">Nota de 1 a 5</label><select id={`${uid}-rating`} value={rating} onChange={(event) => setRating(Number(event.target.value))} className="w-full rounded-xl border border-sand bg-card px-4 py-3 text-sm text-ink outline-none focus:border-orange"><option value={0}>Selecione</option>{[1,2,3,4,5].map((value) => <option key={value} value={value}>{value} estrelas</option>)}</select>{errors.rating && <p className="mt-1 text-xs text-[#DC2626]">{errors.rating}</p>}</div><div className="sm:col-span-2"><label htmlFor={`${uid}-text`} className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-muted-custom">Seu depoimento</label><textarea id={`${uid}-text`} value={text} onChange={(event) => setText(event.target.value)} rows={4} className="w-full resize-y rounded-xl border border-sand bg-card px-4 py-3 text-sm text-ink outline-none focus:border-orange" />{errors.text && <p className="mt-1 text-xs text-[#DC2626]">{errors.text}</p>}</div><div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor={`${uid}-company`}>Não preencha</label><input id={`${uid}-company`} value={company} onChange={(event) => setCompany(event.target.value)} /></div><div className="sm:col-span-2"><button type="button" onClick={submit} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 font-display text-sm font-bold text-primary-foreground shadow-orange hover:bg-orange2 disabled:opacity-60">{loading ? "Enviando..." : "Enviar depoimento"}<Send className="h-4 w-4" aria-hidden="true" /></button></div></div> : <div className="flex items-center rounded-2xl border border-emerald/30 bg-[rgba(34,195,166,0.08)] p-6 text-sm leading-6 text-ink" role="status">Obrigado. Seu depoimento foi enviado para revisão.</div>}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
