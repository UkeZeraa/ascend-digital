import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Página não encontrada | Ascend Digital";
    console.error("404: rota inexistente acessada:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="text-center">
        <p className="font-display text-6xl font-black text-orange">404</p>
        <h1 className="mt-3 mb-2 text-xl font-bold text-ink">Página não encontrada</h1>
        <p className="mb-6 text-muted-custom">O endereço que você tentou abrir não existe.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 font-display text-sm font-bold text-primary-foreground no-underline shadow-orange transition-colors hover:bg-orange2"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
