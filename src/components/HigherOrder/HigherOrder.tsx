import React, { useState } from 'react';

const HigherOrder = (WrappedComponent) => {
	return function WithCounterComponent(props) {
		const [count, setCount] = useState(0);

		const handleIncrement = () => {
			setCount((prevCount) => prevCount + 1);
		};

		return (
			<div className="card-container items-center">
				<WrappedComponent {...props} onBuy={handleIncrement} />
				<div className="flex items-center space-x-4 pt-2">
					<span>counter: {count}</span>
				</div>
			</div>
		);
	};
};

export default HigherOrder;
