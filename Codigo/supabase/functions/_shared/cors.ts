// CORS por allowlist para as edge functions (substitui o antigo `*`).
//
// Configure a env var ALLOWED_ORIGINS (secret da função) com a lista de
// origens de produção separada por vírgula, ex.:
//   ALLOWED_ORIGINS=https://ascendvisual.com.br,https://www.ascendvisual.com.br
// localhost (dev/preview) já é liberado por padrão.

const DEV_ALLOW = [
  "http://localhost:8080",
  "http://localhost:4173",
  "http://localhost:3000",
  "http://localhost:5500",   // VS Code Live Server
  "http://127.0.0.1:5500",
];

function configuredOrigins(): string[] {
  return (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return DEV_ALLOW.includes(origin) || configuredOrigins().includes(origin);
}

/**
 * Cabeçalhos CORS. Ecoa a Origin só quando permitida; caso contrário
 * devolve a primeira origem configurada (ou localhost), bloqueando o
 * browser de ler a resposta cross-origin.
 */
export function buildCors(origin: string | null): Record<string, string> {
  const fallback = configuredOrigins()[0] ?? DEV_ALLOW[0];
  const allowed = isAllowedOrigin(origin) ? origin! : fallback;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...buildCors(origin), "Content-Type": "application/json" },
  });
}
