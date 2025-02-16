import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

export function Notification() {
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
		<div className="relative card-container items-center">
			<h2 className="title">{t('Notification.title')} </h2>
			<Button
				className="relative"
				id="notifyButton"
				type="button"
				onClick={showNotification}
			>
				<span className="absolute top-[-11px] right-[2px] text-lg">
					⏰
				</span>
				{t('Notification.button')}
			</Button>
			<div className="mt-10 mb-10">
				<p className="mb-4">{t('Notification.permission')}</p>
				<p className="font-semibold text-center">{permission}</p>
			</div>

			<div className="w-full h-full bg-gray-200 opacity-50 flex justify-center rounded-md">
				<span className="font-bold text-gray-700 mt-4 text-center">
					element with opacity <br />
					creates context
				</span>
				<span className="absolute bottom-28 right-10">child 🔔</span>
			</div>

			<span className="absolute bottom-20 right-10">neighbour 🔔</span>
		</div>
	);
}
