import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// supabase: força a query a falhar para exercitar o fallback.
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: null, error: new Error("offline") }),
        }),
      }),
    }),
  },
}));

import Testimonials from "@/components/Testimonials";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("Testimonials", () => {
  it("renderiza o fallback quando a busca falha", async () => {
    renderWithClient(<Testimonials />);
    await waitFor(() => {
      expect(screen.getByText(/NordFlux Comércio/)).toBeInTheDocument();
    });
    expect(screen.getByText(/O que os clientes/)).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: /sua nota/i })).toBeInTheDocument();
  });
});
