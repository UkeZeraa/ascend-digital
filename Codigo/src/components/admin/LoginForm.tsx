import { useId, useState } from "react";

type Props = {
  onSubmit: (email: string, password: string) => Promise<void>;
};

const LoginForm = ({ onSubmit }: Props) => {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full border border-sand rounded-xl bg-card px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-orange";

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream2 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-sand bg-card p-8 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
      >
        <h1 className="font-display text-xl font-extrabold text-ink">Painel Ascend Digital</h1>
        <p className="mb-6 mt-1 text-sm text-muted-custom">Acesso restrito.</p>

        {error && (
          <p className="mb-4 rounded-lg bg-[rgba(255,107,107,0.12)] px-3 py-2 text-[13px] text-[#FF6B6B]" role="alert">
            {error}
          </p>
        )}

        <label htmlFor={`${uid}-email`} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-muted-custom">
          E-mail
        </label>
        <input
          id={`${uid}-email`}
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${field} mb-4`}
        />

        <label htmlFor={`${uid}-password`} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-muted-custom">
          Senha
        </label>
        <input
          id={`${uid}-password`}
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${field} mb-6`}
        />

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full rounded-full bg-orange py-3 font-display text-sm font-bold text-primary-foreground shadow-orange transition-colors hover:bg-orange2 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
};

export default LoginForm;
