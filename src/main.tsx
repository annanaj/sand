import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import ReactGA from "react-ga4";
import App from "./App";

const GA_MEASUREMENT_ID = import.meta.env
  .VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

Sentry.init({
  dsn: "https://a45642680c2cdf159885c84851ef3172@o4508092745646080.ingest.de.sentry.io/4508092747677776",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost"],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: import.meta.env.DEV,
});

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
