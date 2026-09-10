# Deploy — Ascend Digital

## 1. Repositório Git novo

O `git` não estava disponível na máquina onde a pasta foi montada, então rode você:

```bash
cd "C:\Users\cumbr\OneDrive\Desktop\Ascend Digital"
git init
git add .
git commit -m "Ascend Digital — estrutura inicial (Codigo + Documentos)"
```

Crie um repositório vazio no GitHub (ex.: `ascend-digital`) e:

```bash
git branch -M main
git remote add origin https://github.com/<voce>/ascend-digital.git
git push -u origin main
```

O `.gitignore` na raiz já exclui `Codigo/node_modules`, `Codigo/dist`, `Codigo/.env` etc.
O `Codigo/.env` **não** vai pro Git; o `Codigo/.env.example` vai.

## 2. Vercel (deploy primário)

1. Vercel ▸ **Add New… ▸ Project** ▸ importe o repositório.
2. **Root Directory:** `Codigo`  ← passo essencial (o projeto Vite vive nessa subpasta).
3. Framework Preset: **Vite** (detectado automaticamente). Build Command `npm run build`,
   Output Directory `dist` — já vêm certos; o `Codigo/vercel.json` reforça.
4. **Environment Variables** (Production + Preview) — valores em `Codigo/.env.example`:
   - `VITE_SUPABASE_URL` = `https://fjxwyqtxtszasxrqqfpd.supabase.co`
   - `VITE_SUPABASE_PROJECT_ID` = `fjxwyqtxtszasxrqqfpd`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_b4-BtUXfaCug4uheuMq73g_9HRODsBI`
5. **Deploy.**

### O que o `Codigo/vercel.json` faz

- **SPA fallback:** qualquer rota sem arquivo (ex.: `/admin`) cai em `/index.html`. As
  páginas estáticas `/portfolio.html`, `/briefing.html` e `/assets/*` são servidas direto
  (a Vercel checa o filesystem antes da rewrite).
- **Headers de segurança** em todas as respostas: `Content-Security-Policy` (mesma política
  do Nginx, com `connect-src` liberado só para o Supabase do projeto), `Strict-Transport-Security`,
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy`. `Cache-Control: immutable` nos assets com hash.

### Depois do primeiro deploy

- Testar no domínio da Vercel: `/`, `/portfolio.html`, `/briefing.html`, `/admin`
  (login), envio do briefing e de um depoimento.
- **Domínio próprio:** adicionar na Vercel; depois atualizar o `<link rel="canonical">` em
  `Codigo/index.html` e o secret `ALLOWED_ORIGINS` das edge functions no Supabase (senão o
  CORS bloqueia os POSTs do formulário a partir do domínio final).
- CSP: se um dia adicionar script/estilo/imagem de outra origem, ajustar a política nos
  **dois** lugares — `Codigo/vercel.json` e `Codigo/nginx.security-headers.conf` — além do
  fallback `<meta>` em `Codigo/vite.config.ts` (`PROD_CSP`).

## 3. Docker / Nginx (alternativa)

`Codigo/` traz `Dockerfile` (Node 20 build → Nginx 1.27), `nginx.conf` e
`nginx.security-headers.conf`. Contexto de build = a própria pasta `Codigo/`:

```bash
cd Codigo
docker build -t ascend-digital .
docker run --rm -p 8088:80 ascend-digital   # http://localhost:8088
```

Em EasyPanel/Hostinger: serviço **App**, build por **Dockerfile**, porta interna **80**,
build args `VITE_SUPABASE_URL` / `VITE_SUPABASE_PROJECT_ID` / `VITE_SUPABASE_PUBLISHABLE_KEY`
(há defaults no `Dockerfile`). O TLS é terminado na borda do painel.

## 4. Backend Supabase (independente do host)

Só é preciso rodar de novo se mexer em schema/edge functions:

```bash
supabase link --project-ref fjxwyqtxtszasxrqqfpd
supabase db push
supabase functions deploy submit-briefing submit-testimonial
```

## 5. Limpeza final

Com a Vercel no ar e tudo conferido, a pasta antiga
`Desktop\Projetos Cumbre\ascend-visual-site-completo\` (backup) pode ser apagada.
