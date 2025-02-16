import React, { useState } from 'react';

type HigherOrderProps = {
	onBuy?: () => void;
};

export const HigherOrder = <P extends object>(
	WrappedComponent: React.ComponentType<P>
) => {
	return function WithCounterComponent(props: P & HigherOrderProps) {
		const [count, setCount] = useState(0);

		const handleIncrement = () => {
			setCount((prevCount) => prevCount + 1);
		};

		const onBuy = props.onBuy || handleIncrement;

		return (
			<div className="card-container items-center">
				<WrappedComponent {...props} onBuy={onBuy} />
				<div className="flex items-center space-x-4 pt-2">
					<span>counter: {count}</span>
				</div>
			</div>
		);
	};
};
