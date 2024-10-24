import React from 'react';
import Lottie, { Action } from 'lottie-react';
import checkmark from './checkmark.json';
import hamburger from './hamburger.json';
import { useRive } from '@rive-app/react-canvas';

interface Interactivity {
	mode: 'scroll' | 'cursor';
	actions: Action[];
}

const interactivity: Interactivity = {
	mode: 'cursor', // nebo scroll
	actions: [
		{
			position: { x: [0, 1], y: [0, 1] },
			type: 'seek',
			frames: [0, 180],
		},
	],
};

export default function Animations() {
	const { rive, RiveComponent } = useRive({
		src: 'https://cdn.rive.app/animations/vehicles.riv',
		autoplay: false,
	});

	const { rive: publish, RiveComponent: PublishButton } = useRive({
		src: 'sand/publish.riv',
		autoplay: false,
	});

	const { rive: localRive, RiveComponent: Button } = useRive({
		src: 'sand/button-machine.riv',
		animations: 'Active',
	});

	return (
		<div className="card-container items-center">
			<h2 className="title">Lottie pre/made</h2>
			<div className="flex gap-3 items-center">
				<Lottie
					animationData={checkmark}
					loop={true} // default is true
					autoplay={true} // default is true
					className="w-10 h-10"
				/>

				<Lottie
					animationData={hamburger}
					loop={false}
					autoplay={false}
					interactivity={interactivity} // need to create type for it
					className="w-10 h-10"
				/>
			</div>

			<h2 className="title">Rive creations</h2>
			<RiveComponent
				onMouseEnter={() => rive && rive.play()}
				onMouseLeave={() => rive && rive.pause()}
				className="w-64 h-20"
			/>
			<PublishButton
				onMouseEnter={() => publish && publish.play()}
				onMouseLeave={() => publish && publish.pause()}
				className="w-64 h-32 mt-[-10px]"
			/>
			<Button
				onMouseEnter={() => localRive && localRive.play()}
				onMouseLeave={() => localRive && localRive.pause()}
				className="w-64 h-20 mt-[-30px]"
			/>
		</div>
	);
}
