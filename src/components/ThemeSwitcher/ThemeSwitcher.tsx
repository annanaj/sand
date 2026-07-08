import React, { useContext } from "react";
import Select, { type StylesConfig } from "react-select";
import { ThemeContext } from "./../ThemeProvider";
import { RxSun } from "react-icons/rx";
import { MdDarkMode } from "react-icons/md";

type ThemeOption = {
  value: string;
  label: React.ReactElement;
};

export function ThemeSwitcher() {
  // ThemeSwitcher is always rendered inside ThemeProvider,
  // so the context value is never null at runtime
  const { theme, toggleTheme } = useContext(ThemeContext)!;

  const options: ThemeOption[] = [
    {
      value: "light",
      label: <RxSun style={{ color: "black" }} />,
    },
    {
      value: "dark",
      label: <MdDarkMode style={{ color: "black" }} />,
    },
  ];

  const styles: StylesConfig<ThemeOption, false> = {
    container: (provided) => ({
      ...provided,
      width: 80,
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "2px",
    }),
  };

  const handleThemeChange = (
    selectedOption: ThemeOption | null,
  ) => {
    if (selectedOption && selectedOption.value !== theme) {
      toggleTheme();
    }
  };

  return (
    <div>
      <Select
        value={options.find(
          (option) => option.value === theme,
        )}
        onChange={handleThemeChange}
        options={options}
        components={{
          IndicatorSeparator: () => null,
        }}
        styles={styles}
      />
    </div>
  );
}
