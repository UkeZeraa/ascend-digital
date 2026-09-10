# Documentos — Ascend Digital

Índice da documentação do projeto. O código fica em `../Codigo/`.

| Arquivo | Conteúdo |
|---|---|
| [`README-projeto.md`](README-projeto.md) | README completo: stack, scripts, variáveis de ambiente, backend Supabase (migrations + edge functions), painel `/admin`, segurança e deploy. |
| [`DATALOG.md`](DATALOG.md) | Registro cronológico reverso de **toda** alteração de arquivo do projeto — o quê, onde e por quê. |
| [`deploy.md`](deploy.md) | Passo a passo: repositório Git novo, deploy na **Vercel** (Root Directory = `Codigo`) e a alternativa via Docker/Nginx. |
| [`canva-brief.md`](canva-brief.md) | Especificações para gerar no Canva a logo e os ícones dos Casos, e como trocar os SVGs atuais pela arte exportada. |
| [`plano-reorganizacao.md`](plano-reorganizacao.md) | Plano que originou esta estrutura (`Codigo/` + `Documentos/`) e o deploy na Vercel. Registro histórico. |

## Estado atual (resumo)

- **Identidade visual:** paleta "Grafite & Aço" (dark sóbrio — fundo `#0B0D10`, acento azul
  `#4C82F7`, acento‑2 teal `#22C3A6`). Cursor customizado = ponto sólido + rastro difuso.
- **Backend:** Supabase `fjxwyqtxtszasxrqqfpd` — tabelas `briefings`, `testimonials`,
  `user_roles`; edge functions `submit-briefing` / `submit-testimonial` (`verify_jwt=false`).
- **Deploy:** Vercel (primário). Docker/Nginx continua disponível em `../Codigo/`.
- **Pendências do dono:** domínio de produção (canonical em `index.html` + CORS
  `ALLOWED_ORIGINS` das edge functions); ajustar preços/stats placeholder; trocar os
  depoimentos-seed por reais via `/admin`; ativar "leaked password protection" no Supabase
  Auth; substituir a imagem OG (hoje aponta para uma URL da Lovable) por uma própria.
