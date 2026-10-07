# Medição e indexação — checklist de publicação

## Google Analytics 4

1. Criar uma propriedade no Google Analytics 4.
2. Copiar o ID no formato `G-XXXXXXXXXX`.
3. Na Vercel, adicionar `VITE_GA_MEASUREMENT_ID` no ambiente de produção.
4. Fazer um novo deploy.
5. Confirmar no relatório Realtime os eventos `whatsapp_click`, `plan_click`, `briefing_start` e `briefing_submit`.

O código não envia dados enquanto essa variável estiver vazia. O site também não envia nomes, e-mails ou telefones como propriedades de Analytics.

## Google Search Console

1. Adicionar `https://ascend.digital/` como propriedade de domínio ou prefixo de URL.
2. Concluir a verificação solicitada pelo Google.
3. Enviar `https://ascend.digital/sitemap.xml`.
4. Solicitar indexação da página inicial e das duas páginas de atendimento.
5. Revisar semanalmente cobertura, consultas e páginas com erro.

## Critério para anúncios

Só iniciar campanhas depois de confirmar que os eventos estão chegando e de observar pelo menos duas semanas de cliques e briefings. A campanha deve usar limite de vagas apenas quando a capacidade estiver realmente disponível.
