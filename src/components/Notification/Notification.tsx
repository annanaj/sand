import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Notification() {
	const [permission, setPermission] = useState<NotificationPermission>(
		window.Notification.permission
	);

	const showNotification = () => {
		if (window.Notification.permission === 'granted') {
			window.Notification.requestPermission().then((permission) => {
				setPermission(permission);

				if (permission === 'granted') {
					new window.Notification('Hello!', {
						body: 'Toto je testovací notifikace.',
						icon: './../sand/logo.png',
					});
				} else {
					console.log('Notifikace byly zamítnuty.');
				}
			});
		} else {
			console.log('Notifikace byly zamítnuty.');
		}
	};

	return (
		<div className="card-container items-center">
			<h2 className="title">Notification API</h2>
			<Button id="notifyButton" type="button" onClick={showNotification}>
				Show Notification
			</Button>
			<div className="mt-5">
				<p>Aktuální stav povolení pro notifikace: {permission}</p>
			</div>
		</div>
	);
}
