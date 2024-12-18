import React from 'react';

type EmailInputProps = {
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function EmailInput({ value, onChange }: EmailInputProps) {
	return (
		<input
			type="email"
			placeholder="Email"
			value={value}
			onChange={onChange}
			aria-required="true"
			aria-label="Email Address"
			required
		/>
	);
}
