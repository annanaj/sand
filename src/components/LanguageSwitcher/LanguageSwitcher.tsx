import React from 'react';
import Select, { StylesConfig } from 'react-select';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const options = [
		{ value: 'en', label: `🇬🇧` },
		{ value: 'cs', label: `🇨🇿` },
	];

	const styles: StylesConfig = {
		container: (provided) => ({
			...provided,
			width: 80,
		}),
		menu: (provided) => ({
			...provided,
			marginTop: '0',
		}),
	};

	const changeLanguage = (selectedOption: { value: string }) => {
		void i18n.changeLanguage(selectedOption.value);
	};

	return (
		<div className="fixed top-2 right-2">
			<Select
				value={options.find((option) => option.value === i18n.language)}
				onChange={changeLanguage}
				options={options}
				menuPortalTarget={document.querySelector('body')}
				components={{
					IndicatorSeparator: () => null,
				}}
				styles={styles}
			/>
		</div>
	);
}
