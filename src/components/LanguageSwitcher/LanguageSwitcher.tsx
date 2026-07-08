import Select, { type StylesConfig } from "react-select";
import { useTranslation } from "react-i18next";

type LanguageOption = { value: string; label: string };

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const options: LanguageOption[] = [
    { value: "en", label: `🇬🇧` },
    { value: "cs", label: `🇨🇿` },
  ];

  const styles: StylesConfig<LanguageOption, false> = {
    container: (provided) => ({
      ...provided,
      width: 80,
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "2px",
    }),
  };

  const changeLanguage = (
    selectedOption: LanguageOption | null,
  ) => {
    if (selectedOption) {
      void i18n.changeLanguage(selectedOption.value);
    }
  };

  return (
    <div>
      <Select
        value={options.find(
          (option) => option.value === i18n.language,
        )}
        onChange={changeLanguage}
        options={options}
        menuPortalTarget={document.querySelector("body")}
        components={{
          IndicatorSeparator: () => null,
        }}
        styles={styles}
      />
    </div>
  );
}
