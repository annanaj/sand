import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import MessageInput from "./MessageInput";
import EmailInput from "./EmailInput";
import useEmailSender from "./useEmailSender";

export function EmailForm() {
  const { t } = useTranslation();
  const { sendEmail, statusMessage, isError } =
    useEmailSender();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    void sendEmail(email, message);
    setEmail("");
    setMessage("");
  };

  return (
    <div className="card-container items-center">
      <h2 className="title">{t("EmailForm.title")}</h2>
      <form onSubmit={handleSubmit} className="form">
        <EmailInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <MessageInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          type="submit"
          aria-label={t("EmailForm.sendButton")}
        >
          {t("EmailForm.sendButton")}
        </Button>
      </form>
      {statusMessage && (
        <p className={isError ? "error" : "success"}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}
