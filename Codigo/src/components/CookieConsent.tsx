import { useEffect, useState } from "react";

// Mesma chave usada por public/js/cookie-consent.js (páginas estáticas) — dispensa
// o aviso nas duas frentes assim que o visitante confirma em qualquer uma delas.
const STORAGE_KEY = "ascend-privacy-notice";

/**
 * Aviso discreto de privacidade/LGPD (o site não usa cookies de rastreamento; isto
 * é sobre os dados que o próprio visitante envia pelo formulário de briefing/depoimento).
 * Fecha e não volta a aparecer (localStorage). Sem bloquear a página — nunca é modal.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // localStorage indisponível (modo privado etc.) — mostra mesmo assim
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setHiding(true);
    window.setTimeout(() => setVisible(false), 220);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignora — só não vai lembrar na próxima visita
    }
  };

  return (
    <div
      role="region"
      aria-label="Aviso de privacidade"
      className={`fixed left-4 right-4 bottom-4 z-[9998] mx-auto flex max-w-[560px] flex-wrap items-center gap-3.5 rounded-2xl border border-sand bg-surface px-[18px] py-3.5 text-[13px] leading-[1.6] text-ink shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-all duration-200 ${
        hiding ? "opacity-0 translate-y-2" : "opacity-100"
      }`}
    >
      <p className="m-0 min-w-[220px] flex-1">
        Usamos o mínimo de dados necessário pra te atender: as informações que você envia no
        formulário ficam guardadas com segurança só pra isso. Sem cookies de rastreamento.{" "}
        <a href="/privacidade.html" className="text-orange underline">
          Política de Privacidade
        </a>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-full bg-orange px-[18px] py-2 font-display text-xs font-bold text-primary-foreground transition-colors hover:bg-orange2"
      >
        Entendi
      </button>
    </div>
  );
};

export default CookieConsent;
