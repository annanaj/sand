import React, { useContext } from 'react';
import Select, { StylesConfig } from 'react-select';
import { ThemeContext } from './../ThemeProvider';
import { RxSun } from 'react-icons/rx';
import { MdDarkMode } from 'react-icons/md';

export function ThemeSwitcher() {
	const { theme, toggleTheme } = useContext(ThemeContext);

	const options = [
		{ value: 'light', label: <RxSun /> },
		{ value: 'dark', label: <MdDarkMode /> },
	];

	const styles: StylesConfig = {
		container: (provided) => ({
			...provided,
			width: 80,
		}),
	};

	const handleThemeChange = (selectedOption: { value: string }) => {
		if (selectedOption.value !== theme) {
			toggleTheme();
		}
	};

	return (
		<div className="fixed top-12 right-2.5">
			<Select
				value={options.find((option) => option.value === theme)}
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
