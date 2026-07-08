import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useEmailSender() {
  const { t } = useTranslation();
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const sendEmail = async (
    email: string,
    message: string,
  ) => {
    try {
      const response = await fetch(
        "http://localhost:5002/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            message,
          }),
        },
      );
      if (response.ok) {
        setStatusMessage(t("EmailForm.sentSuccess"));
        setIsError(false);
      } else {
        setStatusMessage(t("EmailForm.sendError"));
        setIsError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage(t("EmailForm.sendError"));
      setIsError(true);
    }
  };

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return { sendEmail, statusMessage, isError };
}
