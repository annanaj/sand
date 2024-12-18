import React from 'react';

type MessageInputProps = {
	value: string;
	onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export default function MessageInput({ value, onChange }: MessageInputProps) {
	return (
		<textarea
			placeholder="Write the message here"
			value={value}
			onChange={onChange}
			aria-required="true"
			aria-label="Email Message"
			required
		/>
	);
}
