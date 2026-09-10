# Deploy primário: Vercel (ver ../Documentos/deploy.md). Este Dockerfile é a
# alternativa auto-hospedada (EasyPanel/Hostinger). Contexto de build = a pasta Codigo/.

# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Deps (camada cacheável)
COPY package.json package-lock.json ./
RUN npm ci

# Código + build
COPY . .

# As VITE_* são embutidas no bundle em build time. O EasyPanel passa como
# build args; aqui damos default para o projeto atual.
ARG VITE_SUPABASE_URL="https://fjxwyqtxtszasxrqqfpd.supabase.co"
ARG VITE_SUPABASE_PROJECT_ID="fjxwyqtxtszasxrqqfpd"
ARG VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_b4-BtUXfaCug4uheuMq73g_9HRODsBI"
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

RUN npm run build

# ---------- runtime ----------
FROM nginx:1.27-alpine AS runtime

# Config do site (headers de segurança, SPA fallback, cache, gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
