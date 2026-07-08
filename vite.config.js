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
          // Base fallback rule - anything not explicitly allowed elsewhere defaults to same-origin sources only
          "default-src 'self'",

          // unsafe-inline = allows inline <script> (e.g. older libraries, Vite dev)
          // unsafe-eval = allows eval (some bundlers, dev tooling)
          // googletagmanager = Google Analytics / GTM script loader
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",

          // Network requests (fetch, axios, gh) - without this the GitHub API and backend would not work
          "connect-src 'self' http://localhost:5001 http://localhost:5173 https://api.github.com https://www.googletagmanager.com https://unpkg.com https://cdn.jsdelivr.net https://cdn.rive.app https://region1.google-analytics.com https://www.google-analytics.com https://o4508092745646080.ingest.de.sentry.io",

          // CSS styles
          // unsafe-inline = required for Vite, styled-components, some UI libraries
          // fonts.googleapis.com = Google Fonts CSS
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

          // Fonts - fonts.gstatic.com = the actual Google Fonts font files
          "font-src 'self' https://fonts.gstatic.com",

          // Images - data: = inline base64 images, https: = all HTTPS images (e.g. GitHub avatars, CDN images)
          "img-src 'self' data: https:",

          // iframe / embed, DENY is already set above via X-Frame-Options, but CSP frame-src is an extra check
          "frame-src 'self'",

          // Sentry Replay worker runs as a blob: worker
          "worker-src 'self' blob:",
        ].join("; "),

        // enforce HTTPS (HSTS)
        "Strict-Transport-Security":
          "max-age=63072000; includeSubDomains; preload",

        // against MIME sniffing - prevents the browser from misinterpreting the file type
        "X-Content-Type-Options": "nosniff",

        // against embedding the page in an iframe (clickjacking protection)
        "X-Frame-Options": "DENY",

        // Referrer header - does not send where the user came from
        "Referrer-Policy": "no-referrer",

        // Restrict browser APIs (e.g. GPS)
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
