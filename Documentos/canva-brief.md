# Brief para o Canva — Ascend Digital (logo + ícones dos Casos)

> **Status:** opcional / futuro. O site já saiu com **arte SVG feita à mão** (linha
> geométrica, sem emoji) na paleta atual. Este arquivo é a especificação caso você queira
> gerar a arte no Canva e substituir os SVGs. Os caminhos abaixo são relativos à pasta
> **`Codigo/`** do repositório.

## Paleta "Grafite & Aço" (cole no Canva como cores da marca)

| Papel | HEX |
|---|---|
| Fundo (grafite) | `#0B0D10` |
| Superfície | `#14171C` |
| Acento — azul elétrico | `#4C82F7` |
| Acento 2 — teal | `#22C3A6` |
| Texto | `#E6E9EE` |
| Texto suave | `#8A929E` |

Estilo geral: **geométrico, traço/linha ou sólido chapado, sem gradiente arco-íris,
sem emoji, sem mascote, sem sombra realista.** Cantos levemente arredondados.

---

## 1. Logo Ascend Digital

Peça no Canva **dois formatos**:

- **Símbolo isolado** — 1024×1024 px, fundo transparente. Um "A" / seta ascendente
  geométrica (a ideia de *ascend* = subir). Uma versão em `#4C82F7` sobre transparente e
  uma em `#FFFFFF` (para uso sobre o azul).
- **Lockup horizontal** — 1600×400 px, transparente: símbolo + a palavra
  "Ascend Digital" (fonte sem serifa, peso bold; "Digital" pode vir em `#4C82F7`).

Exportar **SVG** (preferencial) e **PNG transparente** de cada um.

Salvar em `Codigo/public/img/logo/`:
- `symbol.svg`
- `lockup.svg`

## 2. Ícones dos Casos (6)

512×512 px cada, **traço ~2 px**, cor única `#4C82F7` (ou `#22C3A6` para variar),
fundo transparente, mesma grade/peso visual entre eles. Um por tema:

| Arquivo | Tema | Referência do SVG atual |
|---|---|---|
| `flow.svg` | Automação / fluxo entre sistemas | 3 nós ligados por linhas |
| `chart.svg` | Dashboard de KPIs | barras + eixo |
| `spark.svg` | Onboarding / crescimento | seta ascendente com nós |
| `window.svg` | Site / landing page | janela de navegador |
| `calendar.svg` | Relatório recorrente | grade de calendário |
| `ledger.svg` | Conciliação financeira | folha com linhas |

Salvar em `Codigo/public/img/casos/` com exatamente esses nomes.

---

## Como trocar no código (quando os arquivos estiverem em `Codigo/public/img/`)

Crie a pasta `Codigo/public/img/` primeiro (foi removida na reorganização por estar vazia).

1. **`Codigo/src/components/Portfolio.tsx`** — no mapa `ICONS`, troque cada bloco
   `<svg>…</svg>` por
   `<img src="/img/casos/flow.svg" alt="" aria-hidden="true" className="w-9 h-9" />`
   (nome por chave: `flow`, `chart`, `spark`, `window`, `calendar`, `ledger`).
2. **`Codigo/public/portfolio.html`** — em cada `<div class="pf-top …">`, troque o `<svg>`
   inline pelo `<img src="/img/casos/<nome>.svg" alt="" width="40" height="40">`
   correspondente (ordem dos cards: flow, chart, spark, window, calendar, ledger).
3. **Logo** — `Codigo/src/components/Navbar.tsx` (`AscendLogo`),
   `Codigo/src/components/Footer.tsx` (monograma `AD`), `Codigo/public/portfolio.html` e
   `Codigo/public/briefing.html` (SVG inline no cabeçalho): troque o `<svg>` do quadrado por
   `<img src="/img/logo/symbol.svg" alt="Ascend Digital" width="36" height="36" />`.
4. `npm run build` e conferir que os arquivos aparecem em `dist/img/`.

Os `<img>` de `/img/...` são servidos como estáticos (Vercel ou Nginx) e não violam a CSP
(`img-src 'self'`).
