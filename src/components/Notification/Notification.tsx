import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

export default function Notification() {
	const { t } = useTranslation();

	const [permission, setPermission] = useState<NotificationPermission>(
		window.Notification.permission
	);

	const showNotification = () => {
		if (window.Notification.permission === 'granted') {
			window.Notification.requestPermission().then((permission) => {
				setPermission(permission);

				if (permission === 'granted') {
					new window.Notification(t('Notification.messageTitle'), {
						body: t('Notification.messageBody'),
						icon: './../sand/logo.png',
					});
				} else {
					console.log(t('Notification.denied'));
				}
			});
		} else {
			console.log(t('Notification.denied'));
		}
	};

	return (
		<div className="card-container items-center">
			<h2 className="title">{t('Notification.title')} </h2>
			<Button id="notifyButton" type="button" onClick={showNotification}>
				{t('Notification.button')}
			</Button>
			<div className="mt-5">
				<p>{t('Notification.permission')}</p>
				<p className="font-semibold text-center">{permission}</p>
			</div>
		</div>
	);
}
