import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type HigherOrderProps = {
  onBuy?: () => void;
};

export const HigherOrder = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return function WithCounterComponent(
    props: P & HigherOrderProps,
  ) {
    const { t } = useTranslation();
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
      setCount((prevCount) => prevCount + 1);
    };

    const onBuy = props.onBuy || handleIncrement;

    return (
      <div className="card-container items-center">
        <WrappedComponent {...props} onBuy={onBuy} />
        <div className="flex items-center space-x-4 pt-2">
          <span>
            {t("HigherOrder.counter", { value: count })}
          </span>
        </div>
      </div>
    );
  };
};
