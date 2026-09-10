import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/admin/LoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BriefingRow = {
  id: string;
  created_at: string;
  name: string;
  whatsapp: string;
  email: string;
  business_name: string;
  project_type: string;
  plan: string | null;
  deadline: string | null;
  current_tools: string | null;
  kpis: string | null;
  description: string | null;
};

type TestimonialRow = {
  id: string;
  created_at: string;
  name: string;
  role: string | null;
  rating: number;
  text: string;
  published: boolean;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

function BriefingsTab() {
  const [q, setQ] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "briefings"],
    queryFn: async (): Promise<BriefingRow[]> => {
      const { data, error } = await supabase
        .from("briefings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as BriefingRow[];
    },
  });

  const rows = useMemo(() => {
    if (!data) return [];
    const term = q.trim().toLowerCase();
    if (!term) return data;
    return data.filter((r) =>
      [r.name, r.email, r.whatsapp, r.business_name, r.project_type].join(" ").toLowerCase().includes(term),
    );
  }, [data, q]);

  if (isLoading) return <p className="p-6 text-sm text-muted-custom">Carregando...</p>;
  if (isError) return <p className="p-6 text-sm text-[#FF6B6B]">Erro ao carregar briefings.</p>;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, e-mail, negócio..."
          className="w-full max-w-sm rounded-xl border border-sand bg-card px-4 py-2.5 text-sm outline-none focus:border-orange"
        />
        <span className="text-xs text-muted-custom">{rows.length} registro(s)</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-sand">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="align-top">
                <TableCell className="whitespace-nowrap text-xs text-muted-custom">{fmtDate(r.created_at)}</TableCell>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-xs">
                  <div>{r.email}</div>
                  <div className="text-muted-custom">{r.whatsapp}</div>
                </TableCell>
                <TableCell>{r.business_name}</TableCell>
                <TableCell className="text-xs">{r.project_type}</TableCell>
                <TableCell className="text-xs">{r.deadline ?? "—"}</TableCell>
                <TableCell className="text-xs">{r.plan ?? "—"}</TableCell>
                <TableCell className="max-w-[320px] text-xs text-muted-custom">
                  {[
                    r.description && `Precisa: ${r.description}`,
                    r.current_tools && `Ferramentas: ${r.current_tools}`,
                    r.kpis && `KPIs: ${r.kpis}`,
                  ]
                    .filter(Boolean)
                    .map((line, idx) => (
                      <p key={idx} className="mb-1">{line}</p>
                    ))}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-custom">
                  Nenhum briefing.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function TestimonialsTab() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async (): Promise<TestimonialRow[]> => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id,created_at,name,role,rating,text,published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as TestimonialRow[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    qc.invalidateQueries({ queryKey: ["testimonials", "published"] });
  };

  const approve = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("testimonials").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e) => toast({ title: "Erro", description: String(e), variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e) => toast({ title: "Erro", description: String(e), variant: "destructive" }),
  });

  if (isLoading) return <p className="p-6 text-sm text-muted-custom">Carregando...</p>;
  if (isError) return <p className="p-6 text-sm text-[#FF6B6B]">Erro ao carregar depoimentos.</p>;

  return (
    <div className="flex flex-col gap-3">
      {(data ?? []).map((t) => (
        <div key={t.id} className="rounded-xl border border-sand bg-card p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <strong className="text-sm">{t.name}</strong>
            {t.role && <span className="text-xs text-muted-custom">· {t.role}</span>}
            <span className="text-xs text-amber">{"★".repeat(t.rating)}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                t.published ? "bg-[rgba(34,195,166,0.15)] text-[#22C3A6]" : "bg-[rgba(227,179,65,0.16)] text-[#E3B341]"
              }`}
            >
              {t.published ? "Publicado" : "Pendente"}
            </span>
            <span className="ml-auto text-[11px] text-muted-custom">{fmtDate(t.created_at)}</span>
          </div>
          <p className="mb-3 text-sm text-ink2 italic">&ldquo;{t.text}&rdquo;</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => approve.mutate({ id: t.id, published: !t.published })}
              disabled={approve.isPending}
              className="rounded-full bg-orange px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-orange2 disabled:opacity-60"
            >
              {t.published ? "Despublicar" : "Aprovar"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Excluir este depoimento?")) remove.mutate(t.id);
              }}
              disabled={remove.isPending}
              className="rounded-full border border-sand px-4 py-1.5 text-xs font-bold text-ink hover:border-[#FF6B6B] hover:text-[#FF6B6B] disabled:opacity-60"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
      {(data ?? []).length === 0 && (
        <p className="py-8 text-center text-sm text-muted-custom">Nenhum depoimento.</p>
      )}
    </div>
  );
}

const Admin = () => {
  const { session, isAdmin, loading, signIn, signOut } = useAuth();

  useEffect(() => {
    document.title = "Painel | Ascend Digital";
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream2">
        <p className="text-sm text-muted-custom">Carregando...</p>
      </main>
    );
  }

  if (!session) return <LoginForm onSubmit={signIn} />;

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream2 px-6 text-center">
        <p className="text-sm text-ink">Esta conta não tem acesso ao painel.</p>
        <button
          type="button"
          onClick={signOut}
          className="rounded-full border border-sand px-5 py-2 text-sm font-semibold text-ink hover:border-orange"
        >
          Sair
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream2 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold text-ink">Painel Ascend Digital</h1>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-sand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-orange"
          >
            Sair
          </button>
        </header>

        <Tabs defaultValue="briefings">
          <TabsList>
            <TabsTrigger value="briefings">Briefings</TabsTrigger>
            <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
          </TabsList>
          <TabsContent value="briefings" className="mt-4">
            <BriefingsTab />
          </TabsContent>
          <TabsContent value="testimonials" className="mt-4">
            <TestimonialsTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Admin;
