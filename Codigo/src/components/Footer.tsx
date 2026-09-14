const Footer = () => (
  <footer className="bg-ink border-t border-[rgba(255,255,255,0.06)] py-10">
    <div className="container flex items-center justify-between flex-wrap gap-5">
      <div className="flex items-center gap-2.5">
        <img src="/img/logo/symbol.png" alt="" width="34" height="34" className="shrink-0" aria-hidden="true" />
        <div className="font-display text-[17px] font-extrabold tracking-[-0.02em] text-ink">
          Ascend <span className="text-orange">Digital</span>
        </div>
      </div>
      <p className="text-[13px] text-[rgba(255,255,255,0.5)]">Automação, dashboards de KPI e sites.</p>
      <div className="flex gap-6">
        {[
          { href: "#como-funciona", label: "Como funciona" },
          { href: "#planos", label: "Planos" },
          { href: "#briefing", label: "Contato" },
          { href: "/privacidade.html", label: "Privacidade" },
        ].map((l) => (
          <a key={l.href} href={l.href} className="text-[13px] text-[rgba(255,255,255,0.5)] no-underline transition-colors hover:text-orange">{l.label}</a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
