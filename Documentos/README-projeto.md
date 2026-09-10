# Ascend Digital — Site

Landing page de página única para serviços de **automação de processos, dashboards de
KPI e desenvolvimento de sites**. Briefing e depoimentos persistidos no Supabase,
painel administrativo interno e uma camada de interação com o mouse (cursor
customizado, parallax, botões magnéticos, tilt 3D). Paleta **"Grafite & Aço"**
(dark sóbrio — fundo `#0B0D10`, acento azul `#4C82F7`, acento‑2 teal `#22C3A6`).

> **O código-fonte fica em `../Codigo/`.** Este arquivo é a referência de arquitetura;
> para rodar/deployar veja `../Codigo/README.md` e `deploy.md` (nesta pasta).

Deploy primário na **Vercel**; Docker (build Vite → Nginx) como alternativa auto-hospedada.

## Stack

- **Vite 5** + **React 18** + **TypeScript**
- **Tailwind CSS 3** + **shadcn/ui** (Radix)
- **React Router 6**, **TanStack Query 5**
- **Supabase** — Postgres (RLS), Auth, Edge Functions (Deno)
- **Vitest** (unit) + **Playwright** (e2e smoke)

## Scripts

| Comando | O quê |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 8080) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build (útil para conferir headers/CSP) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (uma passada) |
| `npm run test:watch` | Vitest em watch |

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_PROJECT_ID` | ID do projeto |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon/publishable key (pública por design) |

Vão todas para o bundle do cliente. **Não** coloque segredos no `.env`.

### Secrets do servidor (Supabase ▸ Edge Functions ▸ Secrets)

| Secret | Efeito |
|---|---|
| `RESEND_API_KEY` | Ativa o e-mail de notificação a cada briefing novo. Ausente → a função apenas não envia e-mail. |
| `BRIEFING_NOTIFY_EMAIL` | Destinatário da notificação (ex.: `news@cumbreagro.com`) |

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já são injetados automaticamente nas Edge Functions.

## Backend

### Estrutura

- `supabase/migrations/` — schema versionado (tabelas `briefings`, `testimonials`, `user_roles`, função `has_role`)
- `supabase/functions/submit-briefing/` — recebe o briefing (contato + `project_type` + prazo, ferramentas, KPIs, descrição), valida, aplica rate-limit + honeypot, insere via service role, notifica por e-mail
- `supabase/functions/submit-testimonial/` — recebe depoimento, valida, insere como `published = false` (aguardando moderação)
- `supabase/functions/_shared/` — CORS allowlist, validadores e listas canônicas compartilhados

### Aplicar migrations / deploy de functions

Com a [Supabase CLI](https://supabase.com/docs/guides/local-development):

```bash
supabase link --project-ref <PROJECT_ID>
supabase db push
supabase functions deploy submit-briefing
supabase functions deploy submit-testimonial
```

> As migrations em `supabase/migrations/` cobrem um projeto **vazio**: criam `briefings`
> (`project_type` + prazo/ferramentas/KPIs), `testimonials` e `user_roles` + `has_role()` do zero. Ver `DATALOG.md`
> para o estado de aplicação.

## Painel administrativo (`/admin`)

Acesso protegido por Supabase Auth. Só usuários com a role `admin` em `public.user_roles` entram.

1. Supabase Studio ▸ **Authentication ▸ Add user** → criar a conta (ex.: `news@cumbreagro.com`) com senha.
2. Conceder a role (SQL Editor):
   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'news@cumbreagro.com'
   on conflict do nothing;
   ```
3. Acessar `/admin` e logar. Abas: **Briefings** (leitura) e **Depoimentos** (aprovar/excluir).

Não há signup público. `/admin` está em `Disallow` no `robots.txt`.

## Segurança

- **Vercel:** `Codigo/vercel.json` aplica os headers em toda resposta — CSP, HSTS,
  `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` —
  e o SPA fallback (`/admin` → `/index.html`).
- **Docker:** `nginx.conf` + `nginx.security-headers.conf` fazem o mesmo no container Nginx.
- `<meta http-equiv="Content-Security-Policy">` injetado no `index.html` só no build (`PROD_CSP`
  em `vite.config.ts`) — fallback caso nenhum header chegue.
- Edge Functions: CORS por allowlist (`ALLOWED_ORIGINS`), rate-limit por IP, honeypot anti-spam,
  validação de comprimento e enums, insert só via service role (nenhuma policy de INSERT anônimo).
- RLS em todas as tabelas; `briefings` e depoimentos não publicados só são legíveis por admin.

> A política de CSP vive em **três** lugares que devem andar juntos: `Codigo/vercel.json`,
> `Codigo/nginx.security-headers.conf` e `PROD_CSP` em `Codigo/vite.config.ts`.

## Deploy

Passo a passo completo em **`deploy.md`** (nesta pasta). Resumo:

- **Vercel (primário):** importar o repo, **Root Directory = `Codigo`**, framework Vite
  detectado, adicionar as `VITE_SUPABASE_*`. `Codigo/vercel.json` cuida de rewrites e headers.
- **Docker (alternativa):** `Dockerfile` multi-stage (Node 20 → Nginx 1.27), contexto de
  build = `Codigo/`, porta 80, build args `VITE_SUPABASE_*`.
- **Domínio próprio:** atualizar `Codigo/index.html` (`<link rel="canonical">`) e o secret
  `ALLOWED_ORIGINS` das edge functions no Supabase.

### Backend (Supabase — independente do host)

Rodar após mudanças de schema/functions:

```bash
supabase link --project-ref fjxwyqtxtszasxrqqfpd
supabase db push
supabase functions deploy submit-briefing submit-testimonial
```

## Testes

- `npm run typecheck` — TypeScript
- `npm test` — Vitest (unitário)
- `npm run test:e2e` — Playwright (smoke). Antes: `npx playwright install --with-deps chromium`

## Pendências

Ver `README.md` desta pasta (seção "Estado atual") e o topo de `DATALOG.md`.
