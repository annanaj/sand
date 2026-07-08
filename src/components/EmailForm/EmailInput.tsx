import React from "react";
import { useTranslation } from "react-i18next";

type EmailInputProps = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function EmailInput({
  value,
  onChange,
}: EmailInputProps) {
  const { t } = useTranslation();

  return (
    <input
      type="email"
      placeholder={t("EmailForm.emailPlaceholder")}
      value={value}
      onChange={onChange}
      aria-required="true"
      aria-label={t("EmailForm.emailAriaLabel")}
      required
    />
  );
}
