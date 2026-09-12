import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { validateTestimonial } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const AUTOPLAY_MS = 8000;

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  text: string;
  avatar_url: string | null;
};

// Fallback usado só se a query falhar ou vier vazia (mesmo conteúdo do seed).
// Empresas fictícias — deixa claro que quem contrata são negócios, não pessoas físicas.
// Sem avatar_url de propósito: o cartão sempre mostra um monograma, nunca uma foto.
const FALLBACK: Testimonial[] = [
  { id: "f1", name: "NordFlux Comércio", role: "E-commerce · Rio de Janeiro", rating: 5, avatar_url: null,
    text: "A conferência de pedidos que tomava a manhã inteira do nosso time virou uma automação. Hoje ninguém toca nisso — só olha o painel." },
  { id: "f2", name: "Clínica Vitalis", role: "Clínica · Belo Horizonte", rating: 5, avatar_url: null,
    text: "O dashboard mudou nossa reunião de segunda. Antes a gente chutava os números, agora abre o link e sabe exatamente onde está." },
  { id: "f3", name: "Agência Prisma", role: "Agência · São Paulo", rating: 5, avatar_url: null,
    text: "Onboarding de cliente novo era e-mail atrás de e-mail. Automatizamos tudo: contrato assinado e o cliente já entra com acesso e pasta pronta." },
  { id: "f4", name: "Casa Lumen", role: "Varejo · Curitiba", rating: 5, avatar_url: null,
    text: "Fizeram o site e ligaram no CRM. O lead preenche e cai no funil com a origem certinha — nada mais se perde." },
  { id: "f5", name: "Grupo Meridian", role: "Serviços · Salvador", rating: 5, avatar_url: null,
    text: "O relatório semanal se monta sozinho e chega no grupo toda segunda 8h. Economia de umas 6 horas por mês, fácil." },
];

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

// Cor do monograma derivada do nome — estável entre renders, sem depender de índice.
function toneFor(name: string): "blue" | "teal" {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % 2 === 0 ? "blue" : "teal";
}

function prefersReducedMotion() {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function StarRating({
  value,
  onChange,
  describedBy,
}: {
  value: number;
  onChange: (n: number) => void;
  describedBy?: string;
}) {
  const set = (n: number) => onChange(Math.min(5, Math.max(1, n)));
  return (
    <div
      role="radiogroup"
      aria-label="Sua nota"
      aria-describedby={describedBy}
      className="flex gap-1.5 mb-4 text-[26px]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); set((value || 0) + 1); }
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); set((value || 1) - 1); }
      }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
          tabIndex={value === n || (!value && n === 1) ? 0 : -1}
          onClick={() => set(n)}
          className={`leading-none transition-colors ${n <= value ? "text-amber" : "text-sand"} hover:text-amber`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
  </svg>
);

const Testimonials = () => {
  const uid = useId();
  const { toast } = useToast();

  const { data, isError } = useQuery({
    queryKey: ["testimonials", "published"],
    queryFn: async (): Promise<Testimonial[]> => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id,name,role,rating,text,avatar_url")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const list = useMemo<Testimonial[]>(
    () => (isError || !data || data.length === 0 ? FALLBACK : data),
    [data, isError],
  );

  // ── Carrossel ──────────────────────────────────────────────────────────────
  const count = list.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // mantém o índice válido se a lista mudar de tamanho
  useEffect(() => {
    setActive((i) => (i >= count ? 0 : i));
  }, [count]);

  const go = useCallback((n: number) => {
    setActive(((n % count) + count) % count);
  }, [count]);
  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  // auto-avanço: pausa em hover/foco, desliga em reduced-motion ou lista de 1
  useEffect(() => {
    if (paused || count <= 1 || prefersReducedMotion()) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [paused, count, active]);

  const current = list[active] ?? list[0];

  // ── Formulário "deixe seu depoimento" ─────────────────────────────────────
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (company.trim()) { setShowSuccess(true); return; }

    const { valid, errors: fieldErrors } = validateTestimonial({ name, text, rating });
    if (!valid) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      toast({ title: "Indisponível", description: "Tente novamente mais tarde.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-testimonial`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
        body: JSON.stringify({ name: name.trim(), role: null, rating, text: text.trim(), company_website: "" }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((body as { error?: string }).error || "Não foi possível enviar.");

      setShowSuccess(true);
      setText("");
      setName("");
      setRating(0);
    } catch (err) {
      toast({
        title: "Erro ao enviar",
        description: err instanceof Error ? err.message : "Falha de conexão.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="depoimentos" className="py-24 bg-card">
      <div className="container">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-orange mb-4">
          <span className="w-5 h-0.5 bg-orange rounded-sm" aria-hidden="true" />
          Depoimentos
        </div>
        <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          O que os clientes <em className="not-italic text-orange">estão falando</em>
        </h2>

        {/* Carrossel — um depoimento grande por vez */}
        <div
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos de clientes"
          className="mt-12 flex items-center gap-3 sm:gap-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={prev}
            aria-label="Depoimento anterior"
            className="shrink-0 w-11 h-11 rounded-full border border-sand text-muted-custom flex items-center justify-center transition-colors hover:border-orange hover:text-orange disabled:opacity-40"
            disabled={count <= 1}
          >
            <Chevron dir="left" />
          </button>

          <div className="flex-1 min-w-0">
            <figure
              key={current.id}
              aria-live={paused ? "polite" : "off"}
              aria-label={`Depoimento ${active + 1} de ${count}`}
              className="tt-card-anim relative mx-auto max-w-[720px] min-h-[300px] sm:min-h-[280px] rounded-[24px] border border-sand bg-surface p-7 sm:p-12 flex flex-col justify-center"
            >
              <div className="text-amber text-sm tracking-[3px] mb-5 relative" aria-label={`Nota ${current.rating} de 5`}>
                {"★".repeat(current.rating)}
                <span className="opacity-25">{"★".repeat(5 - current.rating)}</span>
              </div>

              <blockquote className="relative text-lg sm:text-xl leading-relaxed text-ink font-light">
                {current.text}
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3.5">
                {current.avatar_url ? (
                  <img
                    src={current.avatar_url}
                    alt=""
                    loading="lazy"
                    className="w-12 h-12 rounded-[12px] object-cover shrink-0 ring-1 ring-sand"
                  />
                ) : (
                  // Sem foto de propósito: um monograma no estilo "logo de empresa",
                  // não um retrato — o depoimento vem de um negócio, não de uma pessoa.
                  <span
                    aria-hidden="true"
                    className={`w-12 h-12 rounded-[12px] shrink-0 flex items-center justify-center text-sm font-black tracking-wide ${
                      toneFor(current.name) === "blue" ? "bg-orange-dim text-orange" : "bg-[rgba(34,195,166,0.12)] text-emerald"
                    }`}
                  >
                    {initials(current.name)}
                  </span>
                )}
                <div>
                  <div className="text-sm font-bold text-ink">{current.name}</div>
                  {current.role && <div className="text-xs text-muted-custom">{current.role}</div>}
                </div>
              </figcaption>
            </figure>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {list.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ir para depoimento ${i + 1}`}
                  aria-current={i === active}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-6 bg-orange" : "w-2 bg-sand hover:bg-muted-custom"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Próximo depoimento"
            className="shrink-0 w-11 h-11 rounded-full border border-sand text-muted-custom flex items-center justify-center transition-colors hover:border-orange hover:text-orange disabled:opacity-40"
            disabled={count <= 1}
          >
            <Chevron dir="right" />
          </button>
        </div>

        {/* Enviar depoimento */}
        <div className="mt-14 text-center bg-surface-2 rounded-[20px] p-6 sm:p-8 border border-sand">
          <h3 className="font-display text-lg font-extrabold text-ink mb-2">Trabalhamos juntos? Conta como foi 👇</h3>
          <p className="text-sm text-muted-custom mb-5">
            Seu depoimento passa por uma revisão rápida e pode aparecer aqui pra ajudar quem está decidindo.
          </p>

          {!showSuccess ? (
            <div className="text-left max-w-[520px] mx-auto">
              {/* Honeypot */}
              <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor={`${uid}-company`}>Não preencha</label>
                <input id={`${uid}-company`} type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>

              <label htmlFor={`${uid}-name`} className="block text-xs font-semibold text-muted-custom uppercase tracking-[0.06em] mb-2">Seu nome</label>
              <input
                id={`${uid}-name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                className={`w-full bg-card border rounded-xl font-body text-sm text-ink p-3.5 outline-none focus:border-orange transition-colors mb-1 ${errors.name ? "border-[#FF6B6B]" : "border-sand"}`}
              />
              {errors.name && <p id={`${uid}-name-err`} className="text-[11px] text-[#FF6B6B] mb-2">{errors.name}</p>}

              <div className="mt-3">
                <span className="block text-xs font-semibold text-muted-custom uppercase tracking-[0.06em] mb-2">Sua nota</span>
                <StarRating value={rating} onChange={setRating} describedBy={errors.rating ? `${uid}-rating-err` : undefined} />
                {errors.rating && <p id={`${uid}-rating-err`} className="text-[11px] text-[#FF6B6B] -mt-2 mb-2">{errors.rating}</p>}
              </div>

              <label htmlFor={`${uid}-text`} className="block text-xs font-semibold text-muted-custom uppercase tracking-[0.06em] mb-2">Depoimento</label>
              <textarea
                id={`${uid}-text`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="O que a gente automatizou/construiu e o que mudou no seu dia a dia..."
                aria-invalid={!!errors.text}
                aria-describedby={errors.text ? `${uid}-text-err` : undefined}
                className={`w-full bg-card border rounded-xl font-body text-sm text-ink p-3.5 min-h-[100px] resize-y outline-none focus:border-orange transition-colors mb-1 ${errors.text ? "border-[#FF6B6B]" : "border-sand"}`}
              />
              {errors.text && <p id={`${uid}-text-err`} className="text-[11px] text-[#FF6B6B] mb-2">{errors.text}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                aria-busy={loading}
                className="bg-orange text-primary-foreground font-display text-sm font-bold py-3 px-7 rounded-full border-none cursor-pointer hover:bg-orange2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Enviando..." : "Publicar depoimento →"}
              </button>
            </div>
          ) : (
            <div className="py-5" role="status">
              <div className="text-[40px] mb-3" aria-hidden="true">🎉</div>
              <div className="font-display text-lg font-extrabold text-ink mb-1.5">Depoimento enviado!</div>
              <div className="text-[13px] text-muted-custom">Muito obrigado! Seu depoimento será revisado e publicado em breve.</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
