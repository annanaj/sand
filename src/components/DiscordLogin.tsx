import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

const clientId = "1361263425111720097"; // your Client ID
const redirectUri = "http://localhost:5173/sand/callback"; // correct redirect URL

function DiscordLogin() {
  const { t } = useTranslation();
  const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify email`;

  return (
    <div className="card-container flex items-center gap-2">
      <div className="flex-1">
        <h2 className="title">{t("DiscordLogin.title")}</h2>
        <Button asChild className="flex justify-content">
          <a href={authUrl}>{t("DiscordLogin.button")}</a>
        </Button>
      </div>
      <div>
        <h2 className="title mt-auto">
          {t("Sentry.title")}
        </h2>
        <Button
          variant="warning"
          onClick={() => {
            throw new Error("Test Sentry error 🔥");
          }}
          className="mb-8"
        >
          {t("Sentry.throwButton")}
        </Button>
      </div>
    </div>
  );
}

export default DiscordLogin;
