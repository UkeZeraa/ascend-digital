import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Magnetic } from "@/components/motion";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#casos", label: "Casos" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#planos", label: "Planos" },
];

const AscendLogo = () => (
  <svg width="36" height="36" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <rect width="100" height="100" rx="20" fill="#4C82F7" />
    <path d="M50 20 L50 30 M35 35 L50 30 L65 35 M28 55 L50 30 L72 55" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M22 72 Q36 58 50 65 Q64 58 78 72" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
    <circle cx="50" cy="26" r="5" fill="#FFFFFF" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-[68px] z-[1000] transition-all duration-300 ${
        scrolled ? "bg-[rgba(11,13,16,0.85)] backdrop-blur-[12px] shadow-[0_1px_0_var(--sand)]" : ""
      }`}
    >
      <div className="container h-full flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2.5 no-underline group" aria-label="Ascend Digital — início">
          <AscendLogo />
          <Magnetic strength={0.2} max={5} className="relative isolate">
            {/* Luz suave atrás do nome, só no hover/foco — some em prefers-reduced-motion (transição zerada). */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2.5 -z-10 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 bg-[radial-gradient(circle,rgba(76,130,247,0.4)_0%,rgba(34,195,166,0.18)_50%,transparent_75%)]"
            />
            <div className="font-display text-lg font-extrabold tracking-tight text-ink">
              Ascend <span className="text-orange">Digital</span>
            </div>
          </Magnetic>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-semibold no-underline py-[7px] px-[14px] rounded-full transition-all duration-200 text-ink2 hover:text-orange hover:bg-[rgba(76,130,247,0.1)]"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Magnetic>
              <a
                href="/briefing.html"
                className="bg-orange text-primary-foreground font-bold text-[13px] py-2.5 px-[22px] rounded-full no-underline transition-colors duration-200 hover:bg-orange2 flex items-center gap-1"
              >
                <ArrowIcon />
                Começar projeto
              </a>
            </Magnetic>
          </li>
        </ul>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Abrir menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors text-ink hover:bg-[rgba(255,255,255,0.08)]"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-surface border-l border-[rgba(255,255,255,0.08)] w-[280px] p-0">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <div className="flex flex-col gap-1 pt-16 px-5">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a
                    href={link.href}
                    className="text-[15px] font-semibold text-ink2 no-underline py-3 px-3 rounded-xl transition-colors hover:text-orange hover:bg-[rgba(76,130,247,0.1)]"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a
                  href="/briefing.html"
                  className="mt-4 bg-orange text-primary-foreground font-bold text-[14px] py-3.5 px-5 rounded-full no-underline flex items-center justify-center gap-1.5 hover:bg-orange2 transition-colors"
                >
                  <ArrowIcon />
                  Começar projeto
                </a>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
