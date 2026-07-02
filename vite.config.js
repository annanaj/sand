import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      svgr({ include: "**/*.svg" }),
      EnvironmentPlugin({
        NODE_ENV: mode,
        GQL_GITHUB_TOKEN: "",
        SENTRY_AUTH_TOKEN: "",
      }),
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        org: "mine-92",
        project: "javascript-react",
      }),
    ],
    base: "/sand",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: true, // Enable source map generation
    },
    // Security headers
    server: {
      headers: {
        "Content-Security-Policy": [
          // Zaklad fallback pravidlo - pokud něco není explicitně povolené jinde, defaultně se povolí jen zdroje ze stejného webu
          "default-src 'self'",

          // unsafe-inline = dovolí inline <script> (např. starší knihovny, Vite dev)
          // unsafe-eval = dovolí eval (některé bundlery, dev tooling)
          // googletagmanager = Google Analytics / GTM script loader
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",

          // Network requests (fetch, axios, gh) - bez toho by nefungoval GitHub API ani backend
          "connect-src 'self' http://localhost:5001 http://localhost:5173 https://api.github.com https://www.googletagmanager.com https://unpkg.com https://cdn.jsdelivr.net https://cdn.rive.app https://region1.google-analytics.com https://www.google-analytics.com https://o4508092745646080.ingest.de.sentry.io",

          // CSS styly
          // unsafe-inline = nutné pro Vite, styled-components, některé UI knihovny
          // fonts.googleapis.com = Google Fonts CSS
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

          // Fonty - fonts.gstatic.com = Google Fonts samotné font soubory
          "font-src 'self' https://fonts.gstatic.com",

          // Obrázky - data: = inline base64 obrázky, https: = všechny HTTPS obrázky (např. GitHub avatars, CDN obrázky)
          "img-src 'self' data: https:",

          // iframe / embed, DENY je už nahoře X-Frame-Options, ale CSP frame-src je ještě extra kontrola
          "frame-src 'self'",

          // Sentry Replay worker běží jako blob: worker
          "worker-src 'self' blob:",
        ].join("; "),

        // proti embedování stránky do iframe (clickjacking ochrana)
        "Strict-Transport-Security":
          "max-age=63072000; includeSubDomains; preload",

        // proti MIME sniffingu - zabrání tomu, aby prohlížeč špatně interpretoval typ souboru
        "X-Content-Type-Options": "nosniff",

        // proti embedování stránky do iframe (clickjacking ochrana)
        "X-Frame-Options": "DENY",

        // Referrer hlavička – neposílá odkud uživatel přišel
        "Referrer-Policy": "no-referrer",

        // Omezení browser API (např. GPS)
        "Permissions-Policy": "geolocation=()",
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
    },
  };
});
