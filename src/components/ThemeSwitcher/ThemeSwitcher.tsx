import React, { useContext } from 'react';
import Select, { StylesConfig } from 'react-select';
import { ThemeContext } from './../ThemeProvider';
import { RxSun } from 'react-icons/rx';
import { MdDarkMode } from 'react-icons/md';

export function ThemeSwitcher() {
	const { theme, toggleTheme } = useContext(ThemeContext);

	const options = [
		{ value: 'light', label: <RxSun style={{ color: 'black' }} /> },
		{ value: 'dark', label: <MdDarkMode style={{ color: 'black' }} /> },
	];

	const styles: StylesConfig = {
		container: (provided) => ({
			...provided,
			width: 80,
		}),
		menu: (provided) => ({
			...provided,
			marginTop: '2px',
		}),
	};

	const handleThemeChange = (selectedOption: { value: string }) => {
		if (selectedOption.value !== theme) {
			toggleTheme();
		}
	};

	return (
		<div>
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
