import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Encryption } from "@/components/Notification/Encryption";

export function Notification() {
  const { t } = useTranslation();
  const [permission, setPermission] =
    useState<NotificationPermission>(
      window.Notification.permission,
    );
  const showNotification = () => {
    if (window.Notification.permission === "granted") {
      // už povoleno – rovnou zobrazíme notifikaci
      new window.Notification(
        t("Notification.messageTitle"),
        {
          body: t("Notification.messageBody"),
          icon: "./../sand/logo.png",
        },
      );
    } else {
      // požádáme o oprávnění a případně zobrazíme
      window.Notification.requestPermission().then(
        (permission) => {
          setPermission(permission);

          if (permission === "granted") {
            new window.Notification(
              t("Notification.messageTitle"),
              {
                body: t("Notification.messageBody"),
                icon: "./../sand/logo.png",
              },
            );
          } else {
            console.log(t("Notification.denied"));
          }
        },
      );
    }
  };

  return (
    <div className="flex flex-col card-container gap-8">
      <div className="flex flex-col items-center gap-2">
        <h2 className="title">{t("Notification.title")}</h2>
        <Button
          className="relative"
          id="notifyButton"
          type="button"
          onClick={showNotification}
        >
          {t("Notification.button")}
        </Button>
        <div className="flex gap-2">
          <p>{t("Notification.permission")}</p>
          <p className="font-semibold text-center">
            {permission}
          </p>
        </div>
      </div>
      <Encryption />
    </div>
  );
}
