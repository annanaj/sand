import React from 'react';
import SuperMario from '../svg/supermario.svg';
import HomeIcon from '../svg/home.svg';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ShopItemProps = {
	onBuy?: () => void;
};

export function ShopItem({ onBuy }: ShopItemProps) {
	return (
		<Card>
			<CardHeader>
				<div className="rounded-lg overflow-hidden mb-4">
					<SuperMario />
				</div>

				<CardTitle className="title title-left flex gap-2">
					<HomeIcon />
					Switch Super Mario Bros.
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p>Step into the world of wonders in Super Mario Bros.</p>
			</CardContent>
			<CardFooter className="justify-center">
				<Button aria-label="Buy this game" onClick={onBuy}>
					Buy this game
				</Button>
			</CardFooter>
		</Card>
	);
}
