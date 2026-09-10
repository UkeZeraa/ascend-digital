# Reorganização do projeto Ascend Digital → nova pasta `Ascend Digital/` (Codigo + Documentos) pronta pra Vercel

> **STATUS: CONCLUÍDO (2026-09-10).** Estrutura criada em `C:\Users\cumbr\OneDrive\Desktop\Ascend Digital\`
> (`Codigo/` + `Documentos/`). Legado apagado, docs movidos, `vercel.json` + READMEs criados,
> link-fixes feitos. Verificação em `Codigo/`: `npm install` ok · `typecheck` limpo ·
> `lint` só os 3 erros pré-existentes · `build` gera `dist/` · `test` 16/16 · `vercel.json` JSON válido.
> Pendente (dono): `git init` + push + import na Vercel (git não está no PATH) — passos em `Documentos/deploy.md`.

## Context

Hoje o projeto vive todo em `Desktop\Projetos Cumbre\ascend-visual-site-completo\`, com
código, configs, documentos e **restos do site antigo de barbearia** misturados na mesma
raiz. O dono vai **hospedar na Vercel ainda hoje** e quer um **repositório Git novo e
limpo**, com o código numa pasta e os documentos noutra.

Objetivo: criar `C:\Users\cumbr\OneDrive\Desktop\Ascend Digital\` contendo `Codigo/`
(projeto Vite rodável + configs + `vercel.json` novo) e `Documentos/` (README completo,
DATALOG, brief do Canva, cópia do plano). Sem perder conteúdo útil; apagando só o legado
comprovadamente sem referência. Deixar as "ligações entre arquivos" ajeitadas (imports,
paths de config, docs que citam caminhos, deploy).

A pasta atual **permanece intacta como backup** até a Vercel estar no ar.

### Decisões do dono (respostas coletadas)
- Nova pasta `Ascend Digital` na Área de Trabalho; **repo Git novo**; deploy **Vercel** hoje.
- Layout: subpastas **`Codigo/`** e **`Documentos/`** (Vercel → *Root Directory* = `Codigo`).
- Legado sem uso: **apagar de vez**.

### O que já mudou nesta sessão e vai junto (sem retrabalho)
- Paleta **"Grafite & Aço"** (dark sóbrio: fundo `#0B0D10`, acento azul `#4C82F7`, acento‑2
  teal `#22C3A6`) já aplicada em `src/index.css`, componentes e páginas estáticas,
  substituindo a "Carvão + Lima". Cursor customizado agora é **ponto sólido + rastro difuso**
  (`mix-blend-mode: screen`).
- Carrossel de depoimentos, ícones dos Casos em SVG (sem emoji), transições de scroll
  (`<Reveal>`), tudo já no código que será copiado.
- **Pendência**: `DATALOG.md` / memória ainda descrevem a paleta como "Carvão + Lima" — será
  corrigido para "Grafite & Aço" nesta rodada, e a verificação (`build`/`test`) roda no
  `Codigo/` já reorganizado.

---

## Aprovado o quê

### 1. Criar a estrutura nova
```
C:\Users\cumbr\OneDrive\Desktop\Ascend Digital\
├── .gitignore              (novo — cobre Codigo/node_modules, Codigo/dist, Codigo/.env…)
├── README.md               (novo — explica as duas pastas em ~15 linhas)
├── Codigo\                 ← projeto Vite (Root Directory da Vercel)
└── Documentos\             ← toda a documentação
```

### 2. Copiar o projeto para `Codigo\`
Copiar **todo** o conteúdo de `ascend-visual-site-completo\` para `Codigo\`, **exceto**:
`node_modules\`, `dist\`, `.git\`, `.claude\`, e os arquivos de documentação
(`README.md`, `DATALOG.md`, `docs\`) que vão para `Documentos\` no passo 4.
(Ferramenta: `robocopy` / `Copy-Item` com exclusões — cópia binária preserva os `.jpg`.)

### 3. Apagar o legado em `Codigo\` (sem referência no código — verificado por grep)
- `public\images\` (pasta inteira — 16 mockups barba-/fierce- do site antigo)
- `src\assets\hamburgueria.jpg`, `src\assets\portfolio-promo.jpg`,
  `src\assets\portfolio-servico.jpg`, `src\assets\portfolio-depoimento.jpg`
- `src\tailwind.config.lov.json` (sobra do Lovable; só se referencia a si mesmo)
- `public\placeholder.svg` (default do Lovable, sem uso)
- `public\img\` (pasta + `.gitkeep` — era slot do Canva, que foi deixado de lado)
- `docs\` (após mover `canva-brief.md` — passo 4)

**Mantidos** (têm uso real): `src\assets\{barbearia,mulher,maquiadora,loja,homem}.jpg`
(avatares do fallback de `Testimonials.tsx`), `public\testimonials\*.jpg` (seed de
`20260907120100_testimonials.sql`, servidos em `/testimonials/…`), `public\favicon.ico`,
`public\robots.txt`, todo o `supabase\`.

### 4. Mover os documentos para `Documentos\`
| De | Para | Ação |
|---|---|---|
| `ascend-visual-site-completo\README.md` | `Documentos\README-projeto.md` | move + atualizar caminhos/deploy |
| `ascend-visual-site-completo\DATALOG.md` | `Documentos\DATALOG.md` | move + nova entrada (reorg + correção de paleta) |
| `ascend-visual-site-completo\docs\canva-brief.md` | `Documentos\canva-brief.md` | move; ajustar os paths internos (`public/img/…` → `Codigo/public/img/…`) |
| `C:\Users\cumbr\.claude\plans\valiant-munching-peacock.md` | `Documentos\plano-reorganizacao.md` | copiar (registro histórico) |
| — | `Documentos\README.md` | novo — índice de 1 tela dos documentos |
| — | `Documentos\deploy.md` | novo — passo a passo Vercel + alternativa Docker |

### 5. Arquivos novos em `Codigo\`

**`Codigo\vercel.json`** — substitui o papel do Nginx na Vercel:
- `framework: "vite"`, `buildCommand: "npm run build"`, `outputDirectory: "dist"`
- `rewrites`: `[{ "source": "/(.*)", "destination": "/index.html" }]` (SPA fallback para
  `/admin`; a Vercel serve `portfolio.html`/`briefing.html`/`assets/*` do filesystem antes
  da rewrite, então não quebram)
- `headers`: espelho de `nginx.security-headers.conf` — `Content-Security-Policy` (mesmo
  valor, incl. `connect-src` do Supabase `fjxwyqtxtszasxrqqfpd`), `Strict-Transport-Security`,
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy`; + `Cache-Control immutable` em `/assets/(.*)`.
- O `cspMetaPlugin` de `vite.config.ts` continua injetando o `<meta>` CSP no build como
  fallback — mantido, sem conflito.

**`Codigo\README.md`** — curto: o que é, `npm run dev/build/test/lint/typecheck`, "deploy:
Vercel (Root Directory = `Codigo`, framework Vite, envs `VITE_SUPABASE_*`)", "docs em
`../Documentos/`", "deploy alternativo via Docker: ver `Dockerfile` + `../Documentos/deploy.md`".

### 6. Ligações a ajeitar (o que muda de caminho/contexto)
- **Nada de config de build muda**: `vite.config.ts` (`path.resolve(__dirname,"./src")`),
  `tsconfig*.json` (`@/* → ./src/*`), `tailwind.config.ts` (globs relativos),
  `vitest.config.ts`, `playwright.config.ts`, `eslint.config.js`, `components.json` — todos
  relativos ao próprio arquivo; movem-se juntos e continuam válidos dentro de `Codigo\`.
- **`Codigo\Dockerfile`** — `COPY . .` com contexto = `Codigo\` continua funcionando; só
  adicionar comentário de que o deploy primário agora é Vercel. `nginx.conf` /
  `nginx.security-headers.conf` seguem como fonte-de-verdade dos headers (espelhados no
  `vercel.json`).
- **`.gitignore`** novo em `Ascend Digital\` (raiz do repo): `Codigo/node_modules/`,
  `Codigo/dist/`, `Codigo/.env`, `*.local`, `.DS_Store`, `Codigo/playwright-report/`,
  `Codigo/test-results/`. O `Codigo\.gitignore` atual pode ficar (inofensivo) ou ser
  removido em favor do da raiz — **manter os dois** é mais seguro.
- **`Documentos\README-projeto.md`** (ex-README): trocar a seção "Deploy (EasyPanel /
  Hostinger — Docker)" por "Deploy (Vercel)" + subseção Docker como alternativa; ajustar
  menções a "raiz do repo" → "`Codigo/`"; "Ver DATALOG.md" → mesma pasta.
- **`Documentos\DATALOG.md`**: nova seção `## 2026-09-10 — Reorganização de pastas + Vercel`
  listando a criação de `Codigo/`+`Documentos/`, os arquivos apagados, `vercel.json` novo; e
  **corrigir a seção de 2026-09-08**: "Carvão + Lima" → "Grafite & Aço" (`#0B0D10` / `#4C82F7`
  / `#22C3A6`) e o cursor "lima" → "ponto + rastro".
- **`Documentos\canva-brief.md`**: paths `public/img/...`, `src/components/...` →
  `Codigo/public/img/...`, `Codigo/src/components/...`.
- **Memória** (`~/.claude/.../memory/project-setup.md` + `MEMORY.md`): paleta "Carvão+Lima"
  → "Grafite & Aço"; registrar novo caminho do projeto (`Desktop\Ascend Digital\Codigo`),
  repo Git novo, deploy Vercel.

### 7. Entregar ao dono (não executável aqui — `git` não está no PATH)
Passos prontos no `Documentos\deploy.md` e no resumo final:
1. `cd "C:\Users\cumbr\OneDrive\Desktop\Ascend Digital"` → `git init` → `git add .` →
   `git commit -m "Ascend Digital — estrutura inicial (Codigo + Documentos)"`.
2. Criar repo no GitHub e `git remote add origin … && git push -u origin main`.
3. Vercel ▸ **Add New Project** ▸ importar o repo ▸ **Root Directory = `Codigo`** ▸
   framework detecta **Vite** ▸ adicionar env vars `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY` (valores do `.env.example`) ▸
   Deploy.
4. Conferir no ar: `/` , `/portfolio.html`, `/briefing.html`, `/admin`, envio de briefing e
   de depoimento (edge functions do Supabase seguem iguais).
5. Vercel no ar e ok → pode apagar `Desktop\Projetos Cumbre\ascend-visual-site-completo\`.

---

## Arquivos-chave

**Novos:** `Ascend Digital\README.md`, `Ascend Digital\.gitignore`, `Codigo\vercel.json`,
`Codigo\README.md`, `Documentos\README.md`, `Documentos\deploy.md`,
`Documentos\plano-reorganizacao.md`.

**Movidos:** `README.md`→`Documentos\README-projeto.md`, `DATALOG.md`→`Documentos\DATALOG.md`,
`docs\canva-brief.md`→`Documentos\canva-brief.md`; todo o resto do projeto → `Codigo\`.

**Apagados:** `public\images\` (16), `src\assets\{hamburgueria,portfolio-promo,portfolio-servico,portfolio-depoimento}.jpg`,
`src\tailwind.config.lov.json`, `public\placeholder.svg`, `public\img\`.

**Editados (link-fix):** `Documentos\README-projeto.md`, `Documentos\DATALOG.md`,
`Documentos\canva-brief.md`, `Codigo\Dockerfile` (comentário), memória.

**Intocados (movem-se como estão):** `Codigo\src\**`, `Codigo\public\{css,js,testimonials}\**`,
`Codigo\supabase\**`, `Codigo\e2e\**`, `Codigo\*.config.*`, `Codigo\tsconfig*.json`,
`Codigo\index.html`, `Codigo\components.json`, `Codigo\.env`, `Codigo\.env.example`,
`Codigo\nginx*.conf`, `Codigo\.dockerignore`, `Codigo\.vscode\`.

---

## Verificação (rodar a partir de `Codigo\` depois da cópia)

1. `npm install` (node_modules não é copiado) → `npm run typecheck` limpo →
   `npm run lint` sem **erros novos** (os 3 pré-existentes em `ui/command.tsx`,
   `ui/textarea.tsx`, `tailwind.config.ts` permanecem) → `npm run build` gera `dist\` →
   `npm test` 16/16. Isso também valida a paleta "Grafite & Aço" que ainda não tinha
   passado por `build` completo.
2. `grep` em `Codigo\src` e `Codigo\public` por `hamburgueria|portfolio-promo|/images/|placeholder\.svg|tailwind\.config\.lov`
   → **sem ocorrências** (nenhum import órfão dos arquivos apagados).
3. `vercel.json` é JSON válido (`Get-Content vercel.json | ConvertFrom-Json` sem erro) e o
   valor de `Content-Security-Policy` bate com `nginx.security-headers.conf`.
4. `Documentos\` contém: `README.md`, `README-projeto.md`, `DATALOG.md`, `canva-brief.md`,
   `deploy.md`, `plano-reorganizacao.md`. `Codigo\` **não** contém `README.md` antigo,
   `DATALOG.md`, nem `docs\`.
5. Contagem de arquivos: `Codigo\` (fora `node_modules`/`dist`) = arquivos do projeto atual
   − 22 apagados − 3 docs movidos. Nada de conteúdo útil perdido (spot-check em `src\`,
   `supabase\`, `public\css|js|testimonials`).
6. Abrir a pasta nova no VS Code e `npm run dev` → site sobe em `:8080` com a paleta nova,
   carrossel girando, cursor ponto+rastro; `/admin` carrega.
7. `npm run build && npm run preview` → sem violação de CSP ao navegar/enviar formulários.
