# Seguranca e operacao — Ascend Digital

## Controles no codigo

- HTTPS/HSTS, CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP e CORP em `Codigo/vercel.json`.
- Senhas delegadas ao Supabase Auth, sem armazenamento local de senha.
- MFA exigida para o painel `/admin` por assurance level `aal2`.
- Rate limit inicial por IP, honeypot e validacao server-side nas Edge Functions.
- Normalizacao, limites de tamanho, enums permitidos e renderizacao React escapada.
- Query builder do Supabase e migrations, sem SQL montado com entrada do usuario.
- RLS e `user_roles` para controle de acesso administrativo.
- CORS com allowlist; origens externas recebem 403.
- `service_role` e secrets somente nas Edge Functions.
- `package-lock.json` como fonte versionada da arvore de dependencias.

## Configuracao antes da producao

1. Habilitar MFA no Supabase Auth para toda conta administrativa.
2. Configurar expiracao de sessao e janela de refresh no Supabase Auth.
3. Definir `ALLOWED_ORIGINS` com a URL final da Vercel e dominios aprovados.
4. Configurar `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` e `BRIEFING_NOTIFY_EMAIL` como secrets.
5. Ativar backups automaticos/PITR e confirmar a retencao contratada.
6. Ativar monitoramento de deploys, erros da Vercel, Edge Functions e banco.
7. Fazer backup/export antes de migrations e testar rollback em branch.

## Recuperacao

- Aplicacao: usar rollback da versao anterior na Vercel.
- Banco: migrations destrutivas precisam de migration reversa ou procedimento de restauracao testado.
- Incidente: preservar logs, revogar secrets comprometidos, restaurar a ultima versao valida e testar formulario/admin antes de liberar trafego.

`PMP` precisa ser esclarecido antes de virar uma ferramenta: pode significar PM2, plano de mudancas ou outro processo.
