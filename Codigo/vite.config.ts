import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const SUPABASE_ORIGIN = "https://fjxwyqtxtszasxrqqfpd.supabase.co";
const SUPABASE_WS = "wss://fjxwyqtxtszasxrqqfpd.supabase.co";

// CSP como <meta> só no build de produção (fallback caso o servidor não
// aplique o header — o header canônico está em vercel.json / nginx.security-headers.conf).
// Não é injetado em dev para não quebrar o HMR.
// `frame-ancestors` é omitido de propósito: o browser ignora essa diretiva quando
// vem de <meta> (só vale como header HTTP, e lá ela está).
const PROD_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  `connect-src 'self' ${SUPABASE_ORIGIN} ${SUPABASE_WS}`,
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

function cspMetaPlugin(): Plugin {
  return {
    name: "inject-csp-meta",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        "</title>",
        `</title>\n    <meta http-equiv="Content-Security-Policy" content="${PROD_CSP}" />`,
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), cspMetaPlugin()],
  build: {
    // sem o polyfill de modulepreload não há <script> inline no index.html,
    // o que permite a CSP script-src 'self' sem 'unsafe-inline'.
    modulePreload: { polyfill: false },
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "data-vendor": ["@tanstack/react-query", "@supabase/supabase-js"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
});
