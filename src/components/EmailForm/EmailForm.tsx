import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import MessageInput from './MessageInput';
import EmailInput from './EmailInput';
import useEmailSender from './useEmailSender';

export default function EmailForm() {
	const { sendEmail, statusMessage, isError } = useEmailSender();
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendEmail(email, message);
		setEmail('');
		setMessage('');
	};

	return (
		<div className="card-container items-center">
			<h2 className="title">Send the email</h2>
			<form onSubmit={handleSubmit} className="form">
				<EmailInput
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<MessageInput
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<Button type="submit" aria-label="Send email">
					Send email
				</Button>
			</form>
			{statusMessage && (
				<p className={isError ? 'error' : 'success'}>{statusMessage}</p>
			)}
		</div>
	);
}
