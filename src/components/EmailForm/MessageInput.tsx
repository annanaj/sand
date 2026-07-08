import React from "react";
import { useTranslation } from "react-i18next";

type MessageInputProps = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export default function MessageInput({
  value,
  onChange,
}: MessageInputProps) {
  const { t } = useTranslation();

  return (
    <textarea
      placeholder={t("EmailForm.messagePlaceholder")}
      value={value}
      onChange={onChange}
      aria-required="true"
      aria-label={t("EmailForm.messageAriaLabel")}
      required
    />
  );
}
