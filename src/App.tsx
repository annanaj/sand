import React from 'react';

import * as Sentry from '@sentry/react';

import { Animations } from './components/Animations/Animations';
import { EmailForm } from './components/EmailForm/EmailForm';
import { Keyframes } from './components/Keyframes/Keyframes';
import { Notification } from './components/Notification/Notification';
import { Player } from './components/Player/Player';
import { UsersList } from './components/UsersList/UsersList';
import { ShopItem } from './components/ShopItem/ShopItem';
import { HigherOrder } from './components/HigherOrder/HigherOrder';
import { RepositoriesList } from './components/RepositoriesList/RepositoriesList';

import './index.css';
import './i18n';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher/ThemeSwitcher';

export default function App() {
	const ShopItemWithCounter = HigherOrder(ShopItem);

	return (
		<Sentry.ErrorBoundary>
			<ThemeProvider>
				<div className="absolute top-2 right-2 flex flex-col gap-2">
					<LanguageSwitcher />
					<ThemeSwitcher />
				</div>
				<h1 className="title spacingTop font-black">Sandbox</h1>
				<div className="mainContainer">
					<Notification />
					<Animations />
					<Keyframes />
					<UsersList />
					<EmailForm />
					<Player />
					<ShopItem />
					<ShopItemWithCounter />
					<RepositoriesList
						owners={[
							'bradfrost',
							'csswizardry',
							'gaearon',
							'LeaVerou',
						]}
					/>
				</div>
			</ThemeProvider>
		</Sentry.ErrorBoundary>
	);
}
