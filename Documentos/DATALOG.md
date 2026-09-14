# DATALOG — Ascend Digital

Registro cronológico reverso de toda alteração de arquivo executada no projeto.
Cada entrada lista o arquivo, a ação (`novo` / `alterado` / `removido`) e o motivo.

Plano da última reorganização: `plano-reorganizacao.md` (nesta pasta).

---

## 2026-09-13 — Efeito de hover no wordmark da Navbar (imã + luz)

Pedido do dono: quando passa o mouse sobre "Ascend Digital" na navbar, o texto levanta um
pouquinho em direção do cursor e surge uma luz suave atrás do nome. Nova logo (símbolo
gerado no Higgsfield) aguardando o arquivo do dono pra entrar no lugar do SVG interino.

| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Navbar.tsx` | alterado | Wordmark envolto em `<Magnetic strength={0.2} max={5}>` (reaproveita `useMagnetic`/`canAnimate()` já existentes — desliga sozinho em touch/`prefers-reduced-motion`) — puxa o texto até 5px na direção do cursor. Adicionado um `<span>` absoluto atrás do texto com `radial-gradient` azul/teal borrado (`blur-lg`), `opacity-0` → `opacity-100` em `group-hover`/`group-focus-within` (transição 300ms, zerada em reduced-motion). `<a>` ganhou `group` e o wrapper `relative isolate` (contém o `-z-10` do brilho sem vazar stacking pra fora). |

Pendente: dono vai mandar o arquivo do símbolo gerado (Higgsfield) pra substituir o `AscendLogo`
SVG interino em `Navbar.tsx`/`Footer.tsx`/`public/*.html`.

---

## 2026-09-12 — Depoimentos de empresas fictícias (sem foto), sem aspas decorativas, preço + mensalidade

Pedido do dono: (1) tirar a aspa decorativa gigante do card de depoimento; (2) as "fotos"
dos depoimentos devem parecer de **empresas fictícias**, não de pessoas — reforça que quem
contrata são negócios; (3) em Planos, manter o valor do projeto e **somar um custo mensal**
de hospedagem/manutenção que varia por plano.

### Depoimentos
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Testimonials.tsx` | alterado | Removida a aspa decorativa (`&ldquo;` 80px) do card. `FALLBACK`: nomes de pessoa → **empresas fictícias** (NordFlux Comércio, Clínica Vitalis, Agência Prisma, Casa Lumen, Grupo Meridian), `avatar_url: null` em todas. Removidos os 5 imports de foto (`@/assets/*.jpg`). Quando não há `avatar_url`, o card mostra um **monograma estilo logo** (tile `rounded-[12px]`, não círculo) com cor azul/teal derivada do nome (`toneFor`) em vez do círculo de iniciais antigo — nunca mais uma foto de rosto. |
| `src/components/Testimonials.test.tsx` | alterado | Asserção do fallback `Lucas Mendes` → `NordFlux Comércio`. |
| `src/assets/{barbearia,mulher,maquiadora,loja,homem}.jpg` | removido | Só eram usados pelo `FALLBACK`; sem `avatar_url` não há mais foto nenhuma no componente. |
| `public/testimonials/*.jpg` (5 arquivos) | removido | Eram servidos pelos `avatar_url` das 5 linhas seed no Supabase; a migration abaixo zera esses `avatar_url`, então ficaram órfãos. |
| Supabase `public.testimonials` (migration `testimonials_fictitious_companies`, via `apply_migration`) | alterado (dados) | `UPDATE` nas 5 linhas seed: mesmos nomes fictícios acima, `avatar_url = NULL`. Sem mudança de schema. |

### Planos — preço do projeto + mensalidade separada
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Pricing.tsx` | alterado | `Plan` ganha o campo `monthly` (custo recorrente, renderizado logo abaixo do preço do projeto). Automação `R$ 900` → `+ R$ 129,90/mês` de hospedagem/manutenção; Dashboard de KPIs `R$ 1.200` → `+ R$ 159,90/mês`; Operação completa (`Sob consulta`) → mensalidade também "sob consulta" (cobre também sites sob medida — não virou plano à parte). Parágrafo de intro reescrito: não diz mais "sem mensalidade obrigatória" (agora existe uma, separada do valor do projeto) — "paga o projeto uma vez; manutenção mensal à parte, sem fidelidade". |

Verificação: `npm run typecheck` limpo · `npm run lint` só os 3 erros pré-existentes ·
`npm run build` limpo (bundle de imagens dos depoimentos sumiu do `dist/assets`) · `npm test` 16/16.

---

## 2026-09-10 — Reorganização de pastas (Codigo/ + Documentos/) + deploy Vercel + paleta "Grafite & Aço"

Dono vai hospedar na **Vercel** hoje e pediu um **repositório Git novo e limpo**, com o
código numa pasta e os documentos noutra. Também reprovou a paleta "Carvão + Lima"
("muito forçada, parece um projetinho qualquer") — trocada por **"Grafite & Aço"** e o
cursor virou **ponto sólido + rastro difuso**.

### Estrutura nova
```
Desktop\Ascend Digital\
├── .gitignore  ├── README.md
├── Codigo\        ← projeto Vite (Root Directory da Vercel)
└── Documentos\    ← esta pasta
```

| Arquivo | Ação | Motivo |
|---|---|---|
| `Codigo/vercel.json` | novo | Substitui o Nginx na Vercel: `framework: vite`, SPA fallback (`/(.*)` → `/index.html`), headers de segurança (espelho de `nginx.security-headers.conf` — CSP, HSTS, X-Frame-Options, etc.) e `Cache-Control immutable` em `/assets/(.*)`. |
| `Codigo/README.md` | novo | README curto do código (scripts, envs, deploy Vercel/Docker); aponta para `../Documentos/`. |
| `Ascend Digital/README.md` | novo | Explica as duas pastas. |
| `Ascend Digital/.gitignore` | novo | Cobre `Codigo/node_modules`, `Codigo/dist`, `Codigo/.env`, etc. (o `Codigo/.gitignore` foi mantido também). |
| `Documentos/README.md` | novo | Índice da documentação + "Estado atual". |
| `Documentos/deploy.md` | novo | Passo a passo: `git init`/push, import na Vercel (Root Directory = `Codigo`, envs `VITE_SUPABASE_*`), alternativa Docker, backend Supabase. |
| `Documentos/plano-reorganizacao.md` | novo | Cópia do plano que originou esta rodada. |
| `README.md` → `Documentos/README-projeto.md` | movido+alterado | Seção de deploy reescrita (Vercel primário, Docker alternativa); menção à paleta "Grafite & Aço"; caminhos → `Codigo/`; nota de que o CSP vive em 3 lugares. |
| `DATALOG.md` → `Documentos/DATALOG.md` | movido | Documentação sai do código. |
| `docs/canva-brief.md` → `Documentos/canva-brief.md` | movido+alterado | Paths internos → `Codigo/...`. |
| `Codigo/Dockerfile` | alterado | Comentário: deploy primário agora é Vercel; este Dockerfile é a alternativa, contexto de build = `Codigo/`. |
| `public/images/` (16 arquivos) | removido | Mockups barba-/fierce- do site antigo de barbearia, sem nenhuma referência no código. |
| `src/assets/{hamburgueria,portfolio-promo,portfolio-servico,portfolio-depoimento}.jpg` | removido | Sem import em lugar nenhum. |
| `src/tailwind.config.lov.json` | removido | Sobra do Lovable, só se referenciava a si mesma. |
| `public/placeholder.svg` | removido | Default do Lovable, sem uso. |
| `public/img/.gitkeep` | removido | Era slot do Canva, que foi deixado de lado. |

Mantidos: `src/assets/{barbearia,mulher,maquiadora,loja,homem}.jpg` (avatares do fallback de
`Testimonials.tsx`), `public/testimonials/*.jpg` (seed de `20260907120100_testimonials.sql`),
`favicon.ico`, `robots.txt`, todo o `supabase/`, `Dockerfile`+`nginx*.conf` (alternativa).

### Paleta "Grafite & Aço" (substitui "Carvão + Lima" de 2026-09-08)
Fundo `#0B0D10` · Superfície `#14171C` / `#101319` · Borda `#232830` · Texto `#E6E9EE` /
muted `#8A929E` · Acento (azul elétrico) `#4C82F7` · Acento‑2 (teal) `#22C3A6`. Tokens HSL
do `--primary` voltam a ter **foreground branco** (texto branco sobre o azul).

| Arquivo | Ação | Motivo |
|---|---|---|
| `src/index.css` | alterado | `:root` — todos os tokens HSL + vars hex repropositadas para "Grafite & Aço"; `--primary-foreground` volta a `0 0% 100%`. `.shadow-orange*` e `.dot-grid` → azul. **Cursor reescrito**: `.cursor-dot` 9px sólido + `.cursor-ring` vira rastro difuso (`radial-gradient` azul, sem borda), ambos `mix-blend-mode: screen`; `--cursor-dot-scale` nova. |
| `src/components/{Hero,Navbar,BriefingForm,Pricing}.tsx` | alterado | Literais `rgba(182,255,59,…)`/`rgba(18,226,155,…)` → `rgba(76,130,247,…)`/`rgba(34,195,166,…)`; logo SVG lima→azul com marcas brancas; `<option>` bg `#141716`→`#101319`; sombra featured do Pricing → azul. |
| `src/pages/Admin.tsx` | alterado | Badge publicado/pendente → `#22C3A6` (teal) / `#E3B341` (âmbar). |
| `src/components/Portfolio.tsx` | alterado | Tiles dos Casos: `from-[#1A1D1B]`→`from-[#14171C]`, tons `#1b2411/#10241d`→`#111a2b/#0f2420` (azul/teal). |
| `index.html` | alterado | `theme-color` `#101211`→`#0B0D10`; `<noscript>` recolorido. |
| `public/briefing.html`, `public/portfolio.html` | alterado | `:root` → "Grafite & Aço"; rgba de fundo, foco, badges e `.g-*` → azul/teal; texto de botões sobre o acento `#101211`→`#FFFFFF`; logos SVG → azul/branco. |
| `public/css/pointer-fx.css` | alterado | Mesmo cursor "ponto + rastro" das páginas React; `#b6ff3b`→`#4c82f7`. |

Verificação: rodar de `Codigo/` — `npm install` → `npm run typecheck` limpo → `npm run lint`
sem erros novos → `npm run build` gera `dist/` → `npm test` 16/16. `vercel.json` = JSON válido.

### Pós-deploy Vercel (mesmo dia)
Site no ar em `https://ascend-digital-kohl.vercel.app`. Ajustes:

| Arquivo | Ação | Motivo |
|---|---|---|
| `Codigo/vite.config.ts` | alterado | `PROD_CSP` (o `<meta>` de fallback) perde `frame-ancestors 'none'` — o browser ignora essa diretiva em `<meta>` e gerava warning no console. A diretiva continua no header real (`vercel.json` + `nginx.security-headers.conf`). |

Pendência do dono (não é código): as edge functions barram o POST do formulário por CORS —
o secret **`ALLOWED_ORIGINS`** do Supabase (projeto `fjxwyqtxtszasxrqqfpd` ▸ Edge Functions ▸
Secrets) precisa incluir `https://ascend-digital-kohl.vercel.app` (e depois o domínio
próprio). `_shared/cors.ts` lê o secret em runtime; se não pegar na hora, redeploy de
`submit-briefing` + `submit-testimonial`.

---

> **Nota:** a seção 2026-09-08 abaixo descreve a paleta "Carvão + Lima elétrica", que foi
> **substituída** pela "Grafite & Aço" em 2026-09-10 (acima). O carrossel, os ícones SVG e
> as transições de scroll dessa seção continuam válidos — só as cores mudaram.

## 2026-09-08 — Redesign visual: paleta "Carvão + Lima", carrossel, ícones sem emoji, transições de scroll

Feedback do dono: o preto/branco/laranja "parecia Lovable demais". Nova identidade
**"Carvão + Lima elétrica"**, site **todo escuro**; depoimentos viram **carrossel** (um
grande, auto-avança 8s); ícones dos Casos deixam de ser emoji; transição sutil entre
seções ao rolar. Cursor customizado mantido (recolorido para lima). Canva foi deixado
de lado — arte entregue como SVG feito à mão.

### Paleta "Carvão + Lima elétrica" (tudo escuro)
Fundo `#101211` · Superfície `#1A1D1B` / `#141716` · Texto `#EDF2EE` / muted `#8B968C` ·
Acento lima `#B6FF3B` · Acento-2 esmeralda `#12E29B`. Lima reservada a CTAs, números e ícones.

| Arquivo | Ação | Motivo |
|---|---|---|
| `src/index.css` | alterado | `:root` reescrito: tokens HSL (dark) + vars hex **repropositadas** (`--ink/--ink2` agora = texto claro; `--cream/--cream2` = superfície escura; `--orange` = lima; `--amber` = dourado; novas `--bg/--surface/--surface-2/--emerald`). `body` em `var(--bg)`. Sombras `shadow-orange*` → brilho lima. `.dot-grid` pontos lima. Cursor (`--cursor-ring`, `.cursor-hot`) de laranja → lima. Utils novos `.bg-page/.bg-surface/.bg-surface-2/.text-emerald/.bg-emerald/.border-emerald`. `.reveal` reforçado (subida 24px, delay via `--reveal-delay`); novo `.section-wipe`; keyframe `tt-in` + `.tt-card-anim` (carrossel); ambos neutralizados em `prefers-reduced-motion`. |
| `tailwind.config.ts` | inalterado | Só consome `hsl(var(--…))` — a troca de paleta é toda no `index.css`. |
| `src/components/Hero.tsx` | alterado | Gradientes/badge laranja → lima/esmeralda; `text-primary-foreground` (era branco) → `text-ink`/`text-muted-custom` (agora claros); CTA `bg-orange text-primary-foreground` mantido (texto escuro sobre lima). |
| `src/components/Navbar.tsx` | alterado | `AscendLogo` recolorida (quadrado lima, marcas `#101211`); barra ao rolar → `rgba(16,18,17,.85)`; textos sempre claros (removido o switch scrolled/topo); hovers `rgba(182,255,59,…)`; `SheetContent` `bg-surface`. |
| `src/components/Footer.tsx` | alterado | Wordmark `text-primary-foreground` → `text-ink`; monograma `AD` mantém texto escuro sobre lima. |
| `src/components/BriefingForm.tsx` | alterado | Títulos e texto dos inputs `text-primary-foreground` → `text-ink`; `rgba(242,106,46,…)` → lima; fundo das `<option>` `#1a1612` → `#141716`; erros `#e9452e`/`#ffb4a5` → `#FF6B6B`/`#FFB4B4`. |
| `src/components/Pricing.tsx` | alterado | Sombras `rgba(14,12,10,…)`→`rgba(0,0,0,…)` e featured → lima; borda dos cards `border-transparent`→`var(--sand)`; divisória `bg-cream2`→`bg-sand`; itens da lista com `text-ink2`, excluídos em `text-muted-custom`; botão ghost `hover:bg-ink`→`hover:bg-orange`; badge `⭐`→`★`. |
| `src/pages/Admin.tsx` | alterado | Erros `#c23b1e` → `#FF6B6B`; badges publicado/pendente recoloridos (esmeralda / dourado). Backgrounds/tabelas herdam o tema pela redefinição das vars. |
| `src/components/admin/LoginForm.tsx` | alterado | Sombra `rgba(0,0,0,.45)`; erro `#c23b1e`/`rgba(233,69,46,…)` → `#FF6B6B`. |
| `src/pages/NotFound.tsx` | inalterado | `bg-cream`/`text-ink`/`text-orange` já resolvem para o tema escuro. |
| `index.html` | alterado | `theme-color` `#0E0C0A` → `#101211`; `<noscript>` com fundo/texto do tema escuro. |
| `public/briefing.html` | alterado | `:root` → paleta nova; dot-grid/gradientes de fundo em lima/esmeralda; badge, foco, `.btn-submit` (texto `#101211`), `.form-error` recoloridos; logo SVG + wordmark em lima; `option` bg `#141716`. |
| `public/portfolio.html` | alterado | `:root` → paleta nova, `body` escuro; nav/hero/filtros/cards/modais/CTA recoloridos (texto de botões `#101211`); `.g-*` viram tiles escuros; logo SVG em lima. |
| `public/css/pointer-fx.css` | alterado | `#f26a2e` / `rgba(242,106,46,…)` (cursor) → `#b6ff3b` / `rgba(182,255,59,…)`. |

### Carrossel de depoimentos
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Testimonials.tsx` | alterado | Grid de 5 cards → **carrossel**: um depoimento grande centralizado (`bg-surface`, `min-h` fixo), auto-avança 8s (`setInterval`, desligado em `prefers-reduced-motion` ou lista ≤1), setas `‹`/`›` + dots, pausa em hover/foco (`onMouseEnter`/`onFocusCapture`). `role="region"` + `aria-roledescription="carrossel"`, `aria-live` alterna off/polite, `aria-label="Depoimento N de M"`. Query/`FALLBACK`/`StarRating`/form "deixe seu depoimento" mantidos; `TiltCard` removido do card grande. Erros do form `#e9452e`/`#c23b1e` → `#FF6B6B`; caixa do form `bg-cream`→`bg-surface-2`. |
| `src/components/Testimonials.test.tsx` | inalterado | Segue verde (16/16) — testa o fallback. |

### Ícones dos Casos (sem emoji) + logo
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Portfolio.tsx` | alterado | `icon` deixa de ser emoji: `type IconName` + mapa `ICONS` com 6 SVGs de linha (`flow/chart/spark/window/calendar/ledger`, `stroke=currentColor`). `gradient` → `tone: "lime"|"emerald"` sobre tiles escuros; sombras `rgba(0,0,0,…)`; borda `var(--sand)`. |
| `src/components/HowItWorks.tsx` | alterado | 3 emojis (`🗺️🔗📈`) → SVGs de linha; removido o `useReveal()` interno (o reveal agora vem do wrapper `<Reveal>`). |
| `public/portfolio.html` | alterado | Emojis dos 6 `.pf-top` → SVGs de linha inline; `.pf-top` ganha `color:var(--orange)` + `.tone-emerald`. |
| `docs/canva-brief.md` | novo | Specs (paleta, tamanhos, estilo "sem emoji") + passo a passo pra trocar os SVGs por arte do Canva depois. Canva não é acionável nesta sessão. |
| `public/img/.gitkeep` | novo | Fixa `public/img/` como destino dos assets do Canva (`logo/`, `casos/`). |

### Transição sutil entre seções
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Reveal.tsx` | novo | Wrapper com `IntersectionObserver` (`threshold .15`, `rootMargin -8%`) que adiciona `.visible`; props `delay` (stagger) e `divider` (mostra o `.section-wipe` lima→esmeralda). Anima só via CSS — respeita `prefers-reduced-motion`. |
| `src/pages/Index.tsx` | alterado | Cada seção abaixo da dobra envolta em `<Reveal>` (com `divider` em Portfolio/Testimonials/Pricing/BriefingForm). `Hero`/`Navbar`/`Footer`/`WhatsAppButton` fora. |
| `src/hooks/useReveal.ts` | removido | Lógica absorvida pelo `<Reveal>`; único consumidor era o `HowItWorks`, que passou ao wrapper. |

Verificação: `npm run typecheck` limpo · `npm run lint` sem erros novos (os 3 pré-existentes
em `ui/command.tsx`, `ui/textarea.tsx`, `tailwind.config.ts` permanecem) · `npm run build`
limpo · `npm test` 16/16.

---

## 2026-09-07 — Reposicionamento: Ascend Visual → **Ascend Digital**

Novo foco do negócio: **automação de processos, dashboards de KPI e sites** (não mais
identidade visual para MEI). Marca renomeada e adicionada uma camada de animações de mouse.

### Marca e conteúdo
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Navbar.tsx` | alterado | Wordmark "Ascend **Digital**"; label `Portfólio`→`Casos` (id `#portfolio`→`#casos`); CTA → `/briefing.html`; CTA envolto em `<Magnetic>`. |
| `src/components/Hero.tsx` | alterado | Copy nova (automação/KPI/site); stats em `font-mono`; **parallax** nos gradientes seguindo o mouse; CTA magnético; `dot-grid`. |
| `src/components/HowItWorks.tsx` | alterado | 3 passos reescritos (Mapa da operação → Constrói e conecta → No ar e monitorado). |
| `src/components/Portfolio.tsx` | alterado | Vira "Casos": 6 cards ilustrativos (Automação/Dashboard/Site) com thumb de gradiente+ícone e `<TiltCard>`; sem depender das fotos antigas. |
| `src/components/Testimonials.tsx` | alterado | `FALLBACK` + copy reescritos p/ contexto digital; cards em `<TiltCard>`; imports de avatar renomeados p/ genéricos. |
| `src/components/Pricing.tsx` | alterado | Removido o modal `Dialog` e os links cakto.com.br. 3 tiers novos (Automação / Dashboard de KPIs / Operação completa, preços placeholder); botão → `#briefing`; `<TiltCard>` + `<Magnetic>` no featured; link WhatsApp de apoio. |
| `src/components/Footer.tsx` | alterado | Wordmark + monograma `AD` + tagline "Automação, dashboards de KPI e sites." |
| `src/components/WhatsAppButton.tsx` | alterado | Mensagem para o novo contexto. |
| `index.html` | alterado | `<title>`/description/OG/Twitter/JSON-LD (`ProfessionalService` + ofertas dos 3 tiers); canonical `https://ascend.digital/` (placeholder); fonte **JetBrains Mono** adicionada. |
| `tailwind.config.ts` | alterado | `fontFamily.mono` = JetBrains Mono (usado nos números/stack). |
| `src/pages/Admin.tsx` | alterado | Colunas da aba Briefings → `project_type`, prazo, ferramentas, KPIs; strings "Ascend Digital". |
| `src/components/admin/LoginForm.tsx`, `e2e/smoke.spec.ts` | alterado | Strings/asserts "Ascend Digital"; e2e âncora `#casos`. |
| `README.md` | alterado | Posicionamento, seção de backend (campos do briefing) e nota de migrations. |
| `nginx.conf` | alterado | Comentário de cabeçalho. |

### Animações de mouse
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/hooks/usePointerFx.ts` | novo | `canAnimate()` (guarda touch + `prefers-reduced-motion`), `lerp`, `clamp`. |
| `src/hooks/useMagnetic.ts` | novo | Wrapper que puxa o elemento na direção do cursor. |
| `src/hooks/useTilt.ts` | novo | Inclinação 3D do card seguindo o cursor (rAF). |
| `src/components/motion.tsx` | novo | Componentes `<Magnetic>` e `<TiltCard>`. |
| `src/components/PointerFX.tsx` | novo | Cursor customizado (ponto instantâneo + anel que trilha); montado em `src/App.tsx`. |
| `src/App.tsx` | alterado | `<PointerFX />` no topo da árvore. |
| `src/index.css` | alterado | `.dot-grid`, estilos do cursor (`--cursor-x/-y`, `.cursor-hot/-down/-hidden`), guardas `(pointer: coarse)` / `prefers-reduced-motion` neutralizando cursor + `[data-tilt/-magnetic/-parallax]`. |
| `public/js/pointer-fx.js` | novo | Versão vanilla (cursor + tilt + magnético + parallax) para as páginas estáticas. |
| `public/css/pointer-fx.css` | novo | Estilos do cursor para as páginas estáticas (espelha `src/index.css`). |

### Briefing: campos + banco
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/lib/briefing-options.ts` | alterado | `SEGMENTS/STYLES/COLOR_PREFS/LOGO_STATUS` → `PROJECT_TYPES`, `DEADLINES`, `PLANS` (novos tiers). |
| `src/lib/validators.ts` | alterado | `validateBriefing` reescrito p/ os campos digitais. |
| `src/lib/{validators,briefing-options}.test.ts` | alterado | Casos atualizados (16 testes). |
| `supabase/functions/_shared/{options,validate}.ts` | alterado | Espelho Deno. |
| `src/components/BriefingForm.tsx` | alterado | Novos campos (tipo de projeto, prazo, ferramentas, KPIs, descrição); envio 1:1 com a API. |
| `public/briefing.html` | **novo** (renomeado de `briefing-identidade-mei.html`) | Rebrand + campos digitais + honeypot + barra de progresso; inclui `pointer-fx`. |
| `public/briefing-identidade-mei.html` | removido | Substituído por `briefing.html`. |
| `public/js/briefing.js` | alterado | Mapeamento 1:1 dos campos novos; marca. |
| `public/portfolio.html` | alterado | Reconstruído: nav "Ascend Digital", filtros Automação/Dashboard/Site, 6 casos + modais, `data-tilt`/`data-magnetic`/`data-parallax`, CTA → `/briefing.html`. |
| `src/integrations/supabase/types.ts` | alterado | Regenerado via MCP (colunas novas de `briefings`). |
| `supabase/migrations/20260907130000_briefings_digital_fields.sql` | novo | `DROP` das colunas de identidade visual, `ADD` `project_type/current_tools/kpis/deadline`. |

### Backend (via MCP, projeto `fjxwyqtxtszasxrqqfpd`)
- `apply_migration briefings_digital_fields` — `briefings` agora tem 14 colunas (contato + `project_type/current_tools/kpis/deadline` + `plan/description`). Seed de `testimonials` atualizado p/ o contexto digital (5 linhas).
- Versão `20260907130000` registrada em `supabase_migrations.schema_migrations`.
- `deploy_edge_function submit-briefing` → **v3** (mesma lógica, `_shared` novo).
- `generate_typescript_types` → `types.ts`.
- **Testes ao vivo (curl):** briefing digital válido → `200` + linha com `project_type`; `project_type` inválido/ausente → `400`; honeypot → `200` sem inserir; origem `:5500` (Live Server) permitida. Linhas de QA removidas → **0 briefings, 5 depoimentos publicados**.
- `get_advisors` security: nenhum apontamento novo do reposicionamento. (Pré-existentes do outro app permanecem; `has_role` só `authenticated`, aceitável.) **Novo aviso de projeto:** `auth_leaked_password_protection` desabilitado — ativar em Studio ▸ Auth (proteção contra senha vazada via HaveIBeenPwned).

### Verificação local
`tsc --noEmit` limpo · `vitest` **16/16** · `vite build` limpo (maior chunk 70 kB gzip) · `eslint` sem apontamentos nos arquivos tocados · `vite preview`: `/`, `/briefing.html`, `/portfolio.html`, `/js/pointer-fx.js`, `/css/pointer-fx.css`, `/admin` servem 200; CSP `<meta>` presente; sem handler inline nas páginas estáticas.

### Pendências para o dono
1. **Domínio:** definir e trocar em `index.html` (canonical `ascend.digital` é placeholder) + secret `ALLOWED_ORIGINS` das edge functions.
2. **Preços/copy:** os 3 tiers e as stats do Hero são placeholders — ajuste à vontade em `src/components/Pricing.tsx` e `src/components/Hero.tsx`.
3. **Depoimentos:** os 5 seed são ilustrativos — substitua por reais pelo `/admin` quando tiver.
4. Ativar "leaked password protection" no Supabase Auth.
5. `docker build` no EasyPanel; QA visual/teclado (incluindo `prefers-reduced-motion` e viewport touch → animações somem, cursor nativo volta).

---

## 2026-09-07 — Fase 16: suporte ao VS Code Live Server

| Arquivo | Ação | Motivo |
|---|---|---|
| `supabase/functions/_shared/cors.ts` | alterado | `http://localhost:5500` + `http://127.0.0.1:5500` adicionados ao `DEV_ALLOW`. |
| edge functions `submit-briefing` / `submit-testimonial` | redeploy (v2) | Aplicar o CORS novo. `submit-testimonial` v2 passou a bundlar o `_shared/validate.ts` completo (antes tinha um stub). Testado: `Origin: http://127.0.0.1:5500` → `200` + `Access-Control-Allow-Origin` ecoado. |
| `.vscode/settings.json` | novo | Live Server aponta para `/dist` na porta 5500 e ignora `src/`/`*.tsx`. (Arquivo local — `.vscode/` é gitignored.) |

> **Como usar o Live Server:** `npm run build` primeiro (Live Server não compila React/Vite), depois **Go Live** — ele serve o `dist/`. Para desenvolvimento com hot-reload, use `npm run dev` (porta 8080), que é o equivalente do Vite e já está liberado no CORS.
> Limitação: deep-link `/admin` dá 404 no Live Server (sem SPA fallback). Use `npm run dev` para testar o `/admin`, ou navegue a partir da home.

---

## 2026-09-07 — Fase 15: backend aplicado no Supabase `fjxwyqtxtszasxrqqfpd`

MCP reconectado. Projeto tinha 3 tabelas de outro app (profiles/couples/future_messages, 0 linhas) — intactas.

| Ação | Resultado |
|---|---|
| `apply_migration ascend_visual_full_schema` | `briefings` (18 colunas), `testimonials` (+ 5 seed), `user_roles`, `has_role()`, enum `app_role`, 7 RLS policies, trigger `updated_at`. |
| `INSERT` em `supabase_migrations.schema_migrations` | Registradas as 7 versões dos arquivos em `supabase/migrations/` → `supabase db push` futuro fica em no-op. |
| `deploy_edge_function submit-briefing` | v1 ACTIVE, `verify_jwt=false` (endpoint público de formulário; protegido por rate-limit + honeypot + validação + CORS). |
| `deploy_edge_function submit-testimonial` | v1 ACTIVE, `verify_jwt=false`. |
| `REVOKE EXECUTE has_role FROM anon, public` | Advisor 0028 (anon executa SECURITY DEFINER) resolvido; RLS segue OK via `authenticated`. |
| `generate_typescript_types` → `src/integrations/supabase/types.ts` | Regenerado (agora inclui as tabelas do outro app + as novas). |
| `src/integrations/supabase/client.ts` | `previewAuthStorage` removido → `localStorage` + `detectSessionInUrl`. |

### Testes ponta a ponta (curl real contra as functions)
- briefing 13 campos → 200, linha gravada com `style`/`color_pref`/`has_logo` ✓
- segmento inválido → 400 `{"error":"Segmento inválido."}` ✓
- honeypot preenchido → 200 sem inserir ✓
- testimonial → 200, entra `published=false` ✓
- origem `https://evil.example` → `Access-Control-Allow-Origin` cai pro fallback (não ecoa) ✓
- Dados de QA removidos. Estado final: 0 briefings, 5 depoimentos publicados (seed), 0 pendentes.

### Advisors de segurança (pós-DDL)
- `has_role` (0029, authenticated pode executar): **esperado** para o padrão de checagem do próprio papel — aceitável.
- `update_updated_at`, `handle_new_user`, `rls_auto_enable`: **pré-existentes do outro app** neste projeto — fora do escopo.

### Conta admin — CONCLUÍDO
- `news@cumbreagro.com` criado no Supabase Auth (confirmado) e `INSERT` em `public.user_roles` feito.
- `has_role(<id>, 'admin')` → `true`. Login em `/admin` liberado.

### Ainda pendente (dono)
1. Secrets opcionais: `RESEND_API_KEY` + `BRIEFING_NOTIFY_EMAIL` (e-mail de briefing); `ALLOWED_ORIGINS` (domínio de prod no CORS).
2. `docker build` no EasyPanel; QA visual/teclado; definir domínio (canonical + `ALLOWED_ORIGINS`).

---

## 2026-09-07 — Fase 14: pivô de deploy (Lovable → EasyPanel/Hostinger via Docker)

Decisão do dono: sair do Lovable, publicar por container Docker no EasyPanel.

| Arquivo | Ação | Motivo |
|---|---|---|
| `Dockerfile` | novo | Multi-stage: `node:20-alpine` builda o Vite → `nginx:1.27-alpine` serve o `dist/`. Build args p/ as `VITE_*`. Healthcheck. |
| `nginx.conf` | novo | `server` estático: SPA fallback (`/admin` e rotas do Router), cache (`/assets` imutável, html `must-revalidate`, imagens 30d), gzip, bloqueio de dotfiles. Substitui o `public/_headers` como fonte canônica dos headers. |
| `nginx.security-headers.conf` | novo | Snippet com CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; incluído em cada `location` (regra de herança do `add_header` no Nginx). Copiado p/ `/etc/nginx/snippets/`. |
| `.dockerignore` | novo | Evita mandar `node_modules`, `dist`, `.env`, `.git`, `.claude` etc. p/ o build context. |
| `public/_headers` | removido | Formato Netlify/CF, não lido pelo EasyPanel. Headers agora vêm do `nginx.conf`. |
| `src/integrations/supabase/client.ts` | alterado | Removido o `brokeredPreviewStorage` (auth de preview do Lovable) → `localStorage` puro + `detectSessionInUrl`. |
| `src/integrations/supabase/previewAuthStorage.ts` | removido | Específico do preview do Lovable, sem uso fora dele. |
| `vite.config.ts` | alterado | Removido `lovable-tagger`/`componentTagger`. CSP do build passa a `frame-ancestors 'none'` (sem origens Lovable). |
| `package.json` | alterado | Removida a devDep `lovable-tagger`. Scripts `test:e2e` e `typecheck` adicionados. |
| `package-lock.json` | alterado | `npm install` regenerou o lock (−3 pacotes). |
| `bun.lock`, `bun.lockb` | removidos | Lockfiles do bun desatualizados (divergiam do `package.json`). Projeto padronizado em npm (`npm ci` no Dockerfile). |
| `supabase/functions/_shared/cors.ts` | alterado | Allowlist deixa de ter padrões do Lovable; agora lê `ALLOWED_ORIGINS` (secret, lista por vírgula) + localhost. |
| `playwright.config.ts` | alterado | Reescrito sem o `lovable-agent-playwright-config`: config própria mínima, `webServer` sobe o preview, projetos chromium + mobile. |
| `playwright-fixture.ts` | removido | Reexport do fixture do Lovable. |
| `e2e/smoke.spec.ts` | novo | Smoke: home sem erro de console/CSP + âncoras; menu mobile abre e navega; `/admin` exige login. Requer `npx playwright install`. |

### Ajustes de domínio pendentes (um lugar cada)
- `index.html` → `<link rel="canonical">` (hoje placeholder `ascendvisual.com.br`)
- Supabase → secret `ALLOWED_ORIGINS` das edge functions = domínio(s) de produção
- (CSP não referencia o próprio domínio — nada a mudar em `nginx*.conf` por causa de domínio)

---

## 2026-09-07 — Fases 4–13: front-end, segurança, admin, testes

### Fase 4 — Briefing estático ligado ao Supabase
| Arquivo | Ação | Motivo |
|---|---|---|
| `public/js/briefing.js` | novo | Lógica do formulário externalizada (permite CSP `script-src 'self'`). Barra de progresso + envio real (`fetch` → `submit-briefing`), estado de loading, erro inline com re-tentativa, trava de duplo-envio, honeypot, mapeamento dos 13 campos. Antes o `submit` só fingia sucesso. |
| `public/briefing-identidade-mei.html` | alterado | Removido o `<script>` inline e os handlers `onmouseover/onmouseout`; `<script src="/js/briefing.js" defer>`. Adicionados caixa de erro `#formError`, honeypot `company_website`, `novalidate` (validação manual via `reportValidity`), reordenação da lista de segmentos p/ a canônica, bloco `prefers-reduced-motion`. |

### Fase 5 — Briefing React endurecido
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/BriefingForm.tsx` | alterado | `try/catch` em `fetch`/`json` (antes quebrava em falha de rede); guarda p/ env ausente; honeypot; validação client via `@/lib/validators` com erro por campo + `aria-invalid`/`aria-describedby`; `<label htmlFor>` associados; opções de `@/lib/briefing-options`; `p-6 sm:p-9`. |

### Fase 6 — Depoimentos reais
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Testimonials.tsx` | alterado | Busca `testimonials` publicados via React Query + client Supabase; fallback pro conteúdo antigo se a query falhar/vier vazia. Envio real p/ `submit-testimonial` (antes descartava). Sem `alert()` — erros via toast + inline. Estrelas viram `radiogroup` acessível (setas, `aria-checked`). Avatar por inicial quando sem `avatar_url`. Markup semântico (`figure`/`blockquote`). |
| `src/integrations/supabase/types.ts` | alterado | Adicionados manualmente os tipos de `testimonials`, `user_roles`, função `has_role`, enum `app_role` e as 7 colunas novas de `briefings`, para o front-end tipar antes da regeneração via MCP. |

### Fase 7 — Menu mobile
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Navbar.tsx` | alterado | Antes a navegação sumia no celular (`hidden md:flex`). Agora hambúrguer `md:hidden` → shadcn `Sheet` com os mesmos links + CTA (foco preso, Escape, scroll-lock pelo Radix). Logo aponta p/ `#hero`; SVGs decorativos com `aria-hidden`; listener de scroll `passive`. |

### Fase 8 — Âncoras, reveal, fontes
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/index.css` | alterado | `scroll-padding-top: 84px` (âncoras não ficam mais atrás da navbar fixa); classes `.reveal`/`.reveal.visible` (o `useReveal` do `HowItWorks` não animava nada); bloco `prefers-reduced-motion`; `:focus-visible` global. `@import` de fonte removido. |
| `index.html` | alterado | Fontes via `preconnect` + `<link>` (não bloqueante). Adicionados `canonical`, `theme-color`, `robots`, `preconnect` ao Supabase, JSON-LD (`Service`/`Organization`), `<noscript>`. `<meta>` CSP é injetado no build (ver Fase 11). |

### Fase 9 — Acessibilidade + modal de pagamento
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/components/Pricing.tsx` | alterado | `PaymentModal` feito à mão → shadcn `Dialog` (focus-trap, Escape, scroll-lock, `role=dialog`). Bônus Premium em `<fieldset>/<legend>`; `name` do radgroup único por `useId`; SVGs/símbolos decorativos com `aria-hidden` + `sr-only` nos itens de feature. `p-6 sm:p-8`. |
| `src/components/Hero.tsx` | alterado | `aria-hidden` nos gradientes decorativos, no dot pulsante e nos SVGs de seta. |
| `src/components/HowItWorks.tsx` | alterado | `aria-hidden` no conector tracejado, nos emojis e no traço decorativo. |
| `src/components/Footer.tsx` | alterado | Contraste: textos de `rgba(255,255,255,0.3/0.35)` → `0.5`. `aria-hidden` no bloco "AV". |
| `src/components/WhatsAppButton.tsx` | alterado | `aria-label` no link (antes só `title`); `aria-hidden` no anel e no ícone; URL extraída p/ constante. |
| `src/pages/NotFound.tsx` | alterado | Traduzido p/ PT-BR, `<Link>` no lugar de `<a>`, `document.title`, marcação `<main>`. |

### Fase 10 — Painel admin (`/admin`)
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/hooks/useAuth.ts` | novo | Sessão Supabase + `isAdmin` (consulta `user_roles`), `signIn`/`signOut`, listener `onAuthStateChange`. |
| `src/components/ErrorBoundary.tsx` | novo | Captura erros de render e mostra fallback amigável (antes: tela branca). |
| `src/components/admin/LoginForm.tsx` | novo | Login e-mail/senha (`signInWithPassword`), erro inline. Sem signup público. |
| `src/pages/Admin.tsx` | novo | Guard (sem sessão → login; sessão sem admin → aviso + sair). Abas `Tabs`: **Briefings** (`Table` read-only + busca) e **Depoimentos** (aprovar/despublicar/excluir via `update`/`delete`, invalida a query pública). `document.title`. |
| `src/App.tsx` | alterado | Rota `/admin` acima do catch-all; app embrulhado em `<ErrorBoundary>`. |
| `public/robots.txt` | alterado | `Disallow: /admin`. |

### Fase 11 — Segurança (headers) + SEO + portfólio estático
| Arquivo | Ação | Motivo |
|---|---|---|
| `public/_headers` | novo | CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` + cache imutável p/ `/assets/*`. Formato compatível com o host estático do Lovable. |
| `vite.config.ts` | alterado | Plugin `cspMetaPlugin` injeta `<meta http-equiv="Content-Security-Policy">` só no build (não quebra o HMR do dev). `modulePreload.polyfill=false` (elimina o único `<script>` inline, permitindo `script-src 'self'`). `sourcemap:false`. `manualChunks` (react-vendor / data-vendor) — some o aviso de bundle > 500 kB. Removido `hmr.overlay:false`. |
| `public/portfolio.html` | alterado | Todos os `onclick` inline removidos → `data-*` + `public/js/portfolio.js`. Cards viram `role="button"` + `tabindex=0` (abrem com Enter/Espaço). |
| `public/js/portfolio.js` | novo | Filtros, modais com foco preso + retorno de foco, Escape, reveal on-scroll. Sem handlers inline. |

### Fase 12 — Responsividade
Ajustes de padding responsivo (`p-6 sm:p-8`, `p-5 sm:p-7`) em `BriefingForm`/`Pricing`/`Testimonials`; grade de depoimentos `sm:2 / lg:3 / xl:5`; menu mobile na navbar. Varredura visual 320–1440px fica recomendada como QA manual (sem browser headless neste ambiente).

### Fase 13 — Testes / verificação
| Arquivo | Ação | Motivo |
|---|---|---|
| `src/lib/validators.test.ts` | novo | 10 casos: e-mail, whatsapp, briefing (enums/obrigatórios), depoimento, honeypot. |
| `src/lib/briefing-options.test.ts` | novo | Listas canônicas: contagem, unicidade, aliases reconciliados. |
| `src/components/Testimonials.test.tsx` | novo | Render do fallback quando a query falha (supabase mockado). |

**Resultado local:** `tsc --noEmit` limpo · `vitest` 15/15 · `vite build` limpo (maior chunk 263 kB / 70 kB gzip) · `eslint` nos arquivos novos/alterados sem apontamentos.
`npm run lint` global ainda acusa **4 erros pré-existentes** em arquivos vendorizados/gerados (`src/components/ui/command.tsx`, `ui/textarea.tsx`, `integrations/supabase/previewAuthStorage.ts` [marcado "não editar"], `tailwind.config.ts`) — nenhum introduzido por este trabalho.

### Pendências para o dono
1. **Reconectar o conector Supabase** (claude.ai) à conta/projeto `fjxwyqtxtszasxrqqfpd`. Só então dá pra aplicar migrations + deploy das functions via MCP.
2. Enquanto isso: `supabase link --project-ref fjxwyqtxtszasxrqqfpd && supabase db push && supabase functions deploy submit-briefing submit-testimonial`.
3. Criar a conta admin em Supabase Studio ▸ Authentication e rodar o `INSERT` em `user_roles` (SQL no rodapé de `20260907120200_admin_roles.sql`).
4. (Opcional) Configurar `RESEND_API_KEY` + `BRIEFING_NOTIFY_EMAIL` p/ e-mail de novos briefings.
5. Trocar a OG image temporária (ver topo deste arquivo).
6. QA visual em 320/375/768/1024/1440 + teste de teclado ponta a ponta.

---

## 2026-09-07 — Fase 3: Edge functions

| Arquivo | Ação | Motivo |
|---|---|---|
| `supabase/functions/submit-briefing/index.ts` | alterado | Reescrito sobre os módulos `_shared`. Passa a aceitar/validar os 13 campos, honeypot (`company_website`), CORS por allowlist (era `*`), rate-limit por IP e notificação por e-mail best-effort (Resend). |
| `supabase/functions/submit-testimonial/index.ts` | novo | Recebe depoimentos, valida (nome/texto/nota 1–5) + honeypot + rate-limit, insere como `published = false` para moderação. |
| `supabase/functions/_shared/rate-limit.ts` | novo | Rate limiter em memória por IP, extraído para reuso pelas duas functions. |
| `supabase/functions/_shared/notify.ts` | novo | `sendBriefingEmail()` via Resend; no-op silencioso sem `RESEND_API_KEY`/`BRIEFING_NOTIFY_EMAIL`; nunca lança. |

## 2026-09-07 — Fase 2: Banco de dados (migrations)

| Arquivo | Ação | Motivo |
|---|---|---|
| `.env` | alterado | Repontado para o projeto Supabase `fjxwyqtxtszasxrqqfpd` (decisão do dono). |
| `supabase/config.toml` | alterado | `project_id` atualizado para `fjxwyqtxtszasxrqqfpd`. |
| `supabase/migrations/20260907120000_expand_briefings.sql` | novo | +7 colunas opcionais em `briefings` (ideal_client, style, color_pref, reference, slogan, has_logo, expectations) + índice `created_at DESC`. |
| `supabase/migrations/20260907120100_testimonials.sql` | novo | Tabela `testimonials` com moderação (`published`), RLS (leitura pública só de aprovados), trigger `updated_at`, seed dos 5 depoimentos antes hardcoded. |
| `supabase/migrations/20260907120200_admin_roles.sql` | novo | Enum `app_role`, tabela `user_roles`, função `has_role()` (SECURITY DEFINER), policies de admin (SELECT/UPDATE em briefings; SELECT/UPDATE/DELETE em testimonials); remove a policy "Deny all selects on briefings". |
| `public/testimonials/*.jpg` | novo | 5 fotos de avatar dos depoimentos-seed, copiadas de `src/assets/` para servir por caminho estável (`/testimonials/...`). |

> **Aplicação:** migrations e deploy das functions serão executados via MCP após a reconexão do conector Supabase (pendência do dono). Até lá os arquivos estão prontos para `supabase db push` / `functions deploy`.

## 2026-09-07 — Fase 1: Constantes e validadores compartilhados

| Arquivo | Ação | Motivo |
|---|---|---|
| `src/lib/briefing-options.ts` | novo | Fonte única das listas canônicas (segmentos, planos, estilos, cores, status de logo). Reconcilia as duas listas divergentes que existiam entre o formulário React e o HTML estático. |
| `src/lib/validators.ts` | novo | Validadores puros e testáveis (`validateEmail`, `validateWhatsapp`, `validateBriefing`, `validateTestimonial`) usados pelo front-end; espelham as regras da edge function. |
| `supabase/functions/_shared/options.ts` | novo | Cópia Deno das listas canônicas para as edge functions (não podem importar de `src/`). |
| `supabase/functions/_shared/cors.ts` | novo | `buildCors(origin)` com allowlist de origens (Lovable + domínio custom) substituindo `Access-Control-Allow-Origin: *`. |
| `supabase/functions/_shared/validate.ts` | novo | Validação de payload (comprimentos, enums, honeypot) reutilizável pelas duas edge functions. |

## 2026-09-07 — Fase 0: Docs e higiene

| Arquivo | Ação | Motivo |
|---|---|---|
| `DATALOG.md` | novo | Este registro. Exigência do projeto: toda alteração deve ser logada em `.md`. |
| `README.md` | alterado | Substituído o stub "TODO" por documentação real: stack, scripts, variáveis de ambiente, secrets do Supabase, migrations, criação do usuário admin e deploy. |
| `.env.example` | novo | Modelo das variáveis `VITE_*` sem segredos, para novos ambientes. |
| `.gitignore` | alterado | Adicionado `.env` (mantém `.env.example` versionado). A chave anon é pública por design, mas segredos locais não devem ser versionados. |
| `src/App.css` | removido | Boilerplate do template Vite, sem `import` em nenhum lugar do código. |

### Pendências registradas (ação do dono)
- **`.env` versionado:** se o arquivo já estiver no controle de versão, rodar `git rm --cached .env` após este trabalho.
- **OG image:** `index.html` aponta para uma URL de preview temporária do Lovable (`pub-...r2.dev/...lovable.app-...png`). Substituir por um asset permanente (`public/og-image.png`, 1200×630).
- **Secrets do Supabase (opcionais):** configurar `RESEND_API_KEY` e `BRIEFING_NOTIFY_EMAIL` no painel do Supabase para ativar a notificação por e-mail de novos briefings. Sem eles, a função apenas não envia e-mail.
- **Usuário admin:** criar a conta `news@cumbreagro.com` em Supabase Studio ▸ Authentication ▸ Add user; o acesso ao `/admin` só é liberado após o `INSERT` na tabela `user_roles` (feito via MCP durante a Fase 10).
