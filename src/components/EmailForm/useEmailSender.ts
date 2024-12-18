import { useState, useEffect } from 'react';

export default function useEmailSender() {
	const [statusMessage, setStatusMessage] = useState('');
	const [isError, setIsError] = useState(false);

	const sendEmail = async (email, message) => {
		try {
			const response = await fetch('http://localhost:5002/send-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, message }),
			});
			if (response.ok) {
				setStatusMessage('Email sent successfully!');
				setIsError(false);
			} else {
				setStatusMessage('Error while sending the email. Go fix it.');
				setIsError(true);
			}
		} catch (error) {
			console.error('Error:', error);
			setStatusMessage('Error while sending the email. Go fix it.');
			setIsError(true);
		}
	};

	useEffect(() => {
		if (statusMessage) {
			const timer = setTimeout(() => {
				setStatusMessage('');
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [statusMessage]);

	return { sendEmail, statusMessage, isError };
}
