import React from 'react';
import Select, { StylesConfig } from 'react-select';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
	const { i18n, t } = useTranslation();

	const options = [
		{ value: 'en', label: `🇬🇧 ${t('Language.en')}` },
		{ value: 'cs', label: `🇨🇿 ${t('Language.cs')}` },
	];

	const styles: StylesConfig = {
		container: (provided) => ({
			...provided,
			width: 100,
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
				styles={styles}
			/>
		</div>
	);
}
