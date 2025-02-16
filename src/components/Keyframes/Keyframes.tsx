import React, { useEffect, useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { Button } from '@/components/ui/button';
import Spinner from '../svg/spinner.svg';
import styles from './Keyframes.module.scss';

export function Keyframes() {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	// useEffect pro sledovani sirky okna a nasledne logiky
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		// pridani event listeneru
		window.addEventListener('resize', handleResize);
		// cleanup funkce při unmountu komponenty
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	// prazdny dependency array tj effect probehne jen pri 1.renderu
	// zmenu zajistuje sam handler handleresize, kdybysme dali do deps treba windowWidth
	// byl by to loop infinite

	return (
		<div className="card-container items-center">
			<h2 className="title">Keyframes</h2>
			<p className="pb-8">Window width with useEffect: {windowWidth}px</p>
			<div className="flex gap-3 mt-5">
				<div
					className={`${styles.floatingCircle} ${styles.first}`}
				></div>
				<div
					className={`${styles.floatingCircle} ${styles.second}`}
				></div>
				<div
					className={`${styles.floatingCircle} ${styles.third}`}
				></div>
			</div>
			<Button className={styles.button}>Hey there</Button>
			<ImSpinner9 className={styles.spinner} />
			<div className={styles.wheel} aria-labelledby="loading...">
				<Spinner />
			</div>
		</div>
	);
}
