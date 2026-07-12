/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),

      // Každý import .svg je React komponenta (nestandardní, ale záměrné).
      // Default konvence by byla bez `include` + importy přes "./logo.svg?react".
      svgr({ include: "**/*.svg" }),

      EnvironmentPlugin({
        // ⚠️ Hodnota se při buildu zapéká do klientského bundlu — kdokoliv
        // si ji přečte v devtools. Používat jen read-only token s minimálním
        // scope, ideálně přesunout volání GitHub API za backend proxy.
        GQL_GITHUB_TOKEN: "",
        // NODE_ENV řeší Vite samo, SENTRY_AUTH_TOKEN je build-time secret
        // a do bundlu nepatří vůbec — proto tu obojí chybí.
      }),

      // Sentry jen když je k dispozici token (CI/produkční build) —
      // lokální build se zbytečně nezdržuje a nevaruje.
      ...(env.SENTRY_AUTH_TOKEN
        ? [
            sentryVitePlugin({
              authToken: env.SENTRY_AUTH_TOKEN,
              org: "mine-92",
              project: "sand",
              release: {
                // Release name defaults to `git rev-parse HEAD`;
                // associate commits so Sentry can show suspect commits
                // (requires full git history in CI: fetch-depth: 0).
                setCommits: { auto: true },
              },
              sourcemaps: {
                // Po uploadu do Sentry mapy smazat, ať se nedeployují.
                filesToDeleteAfterUpload: [
                  "./dist/**/*.js.map",
                ],
              },
            }),
          ]
        : []),
    ],

    base: "/sand/",

    resolve: {
      alias: {
        // import.meta.dirname vyžaduje Node 20.11+
        "@": `${import.meta.dirname}/src`,
      },
    },

    build: {
      // "hidden" = mapy se vygenerují (pro Sentry), ale .js soubory na ně
      // neodkazují, takže prohlížeč cizích návštěvníků je nestahuje.
      sourcemap: "hidden",
    },

    // ⚠️ Platí JEN pro dev server. Produkční hosting musí tyhle hlavičky
    // posílat sám (Netlify _headers, nginx, Cloudflare...). Tady slouží
    // hlavně k tomu, aby CSP problémy vyplavaly už při vývoji.
    server: {
      headers: {
        "Content-Security-Policy": [
          // Fallback — co není povoleno jinde, smí jen ze same-origin
          "default-src 'self'",

          // unsafe-inline + unsafe-eval vyžaduje Vite dev/HMR;
          // v produkční CSP (na hostingu) by měly být přísnější
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",

          // fetch/XHR cíle — GitHub API, backend, analytics, Sentry
          "connect-src 'self' http://localhost:5001 http://localhost:5173 https://api.github.com https://www.googletagmanager.com https://unpkg.com https://cdn.jsdelivr.net https://cdn.rive.app https://region1.google-analytics.com https://www.google-analytics.com https://o4508092745646080.ingest.de.sentry.io",

          // unsafe-inline nutné pro Vite a inline styly UI knihoven
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

          "font-src 'self' https://fonts.gstatic.com",

          // data: = inline base64, https: = externí obrázky (avatary, CDN)
          "img-src 'self' data: https:",

          "frame-src 'self'",

          // Sentry Replay běží jako blob: worker
          "worker-src 'self' blob:",
        ].join("; "),

        // HSTS — na localhostu no-op, na produkci ho stejně musí
        // poslat hosting; tady jen pro úplnost
        "Strict-Transport-Security":
          "max-age=63072000; includeSubDomains; preload",

        // Zákaz MIME sniffingu
        "X-Content-Type-Options": "nosniff",

        // Clickjacking — zákaz vložení do iframe
        "X-Frame-Options": "DENY",

        // Neposílat referrer
        "Referrer-Policy": "no-referrer",

        // Zákaz vybraných browser API
        "Permissions-Policy": "geolocation=()",
      },
    },

    test: {
      globals: true, // → přidat "vitest/globals" do types v tsconfig.app.json
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
