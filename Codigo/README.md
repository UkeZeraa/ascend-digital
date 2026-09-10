# Ascend Digital — Código

Landing page (Vite + React + TS + Tailwind + shadcn/ui) para serviços de **automação de
processos, dashboards de KPI e sites**. Briefing e depoimentos no Supabase, painel `/admin`
e uma camada de interação com o mouse (cursor customizado, parallax, botões magnéticos,
tilt 3D). Paleta **"Grafite & Aço"** (dark sóbrio).

> Documentação completa (arquitetura, backend, DATALOG, deploy) em **`../Documentos/`**.

## Scripts

| Comando | O quê |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Servidor de desenvolvimento (porta 8080) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build (confere headers/CSP) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Vitest (unitário) |
| `npm run test:e2e` | Playwright (smoke) |

## Variáveis de ambiente

Copie `.env.example` para `.env`. Todas vão para o bundle do cliente — **não** coloque
segredos aqui (a publishable key do Supabase é pública por design).

| Variável | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_PROJECT_ID` | ID do projeto |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon/publishable key |

## Deploy

**Vercel (primário).** Importe o repositório e defina **Root Directory = `Codigo`**. A
Vercel detecta o framework **Vite** sozinho (`npm run build` → `dist/`). Adicione as três
`VITE_SUPABASE_*` como Environment Variables. `vercel.json` já cuida do SPA fallback
(`/admin`) e dos headers de segurança (CSP, HSTS, etc.).

**Docker (alternativo).** `Dockerfile` multi-stage (Node 20 → Nginx 1.27) + `nginx.conf` +
`nginx.security-headers.conf`, contexto de build = esta pasta `Codigo/`. Passo a passo em
`../Documentos/deploy.md`.

## Backend (Supabase — independente do host)

`supabase/` traz migrations e as edge functions `submit-briefing` / `submit-testimonial`.
Detalhes em `../Documentos/README-projeto.md`.
