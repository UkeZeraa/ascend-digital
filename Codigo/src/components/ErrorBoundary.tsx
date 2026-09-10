import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink mb-2">Algo deu errado</h1>
          <p className="text-muted-custom mb-6">
            Tivemos um problema ao carregar esta página. Tente recarregar; se continuar, fale com a gente pelo WhatsApp.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 font-display text-sm font-bold text-primary-foreground shadow-orange transition-colors hover:bg-orange2"
          >
            Recarregar
          </button>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
