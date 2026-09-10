const WHATSAPP_URL =
  "https://wa.me/5511954895398?text=" +
  encodeURIComponent(
    "Olá! Vim pelo site da Ascend Digital e quero conversar sobre automação / dashboard / site.",
  );

const WhatsAppButton = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar pelo WhatsApp"
    className="fixed bottom-7 right-7 w-[58px] h-[58px] bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_6px_24px_rgba(37,211,102,0.4)] z-[9000] transition-all duration-200 no-underline hover:scale-[1.08] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(37,211,102,0.5)]"
  >
    <span className="absolute inset-[-4px] rounded-full border-2 border-[rgba(37,211,102,0.3)] animate-waping" aria-hidden="true" />
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.822 6.5L4 29l7.745-1.797A11.94 11.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="white" />
      <path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.05c.15.2 2.08 3.17 5.04 4.45.7.3 1.25.48 1.68.62.7.22 1.34.19 1.84.12.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.19-.57-.34z" fill="#25D366" />
    </svg>
  </a>
);

export default WhatsAppButton;
