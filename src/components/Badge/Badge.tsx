import React, { PropsWithChildren } from "react";
import cx from "classnames";
import styles from "./Badge.module.scss";

type BadgeVariant =
  | "active"
  | "inactive"
  | "success"
  | "error"
  | "warning"
  | "info";

type BadgeProps = {
  variant: BadgeVariant;
} & PropsWithChildren;

const BadgeRoot = ({ children, variant }: BadgeProps) => {
  return (
    <span className={cx(styles.badge, styles[variant])}>
      {children}
    </span>
  );
};

const BadgeDot = () => <span className={styles.dot} />;

const BadgeLabel = ({ children }: PropsWithChildren) => (
  <span>{children}</span>
);

type BadgeCountProps = { value: number; max?: number };

const BadgeCount = ({
  value,
  max = 99,
}: BadgeCountProps) => (
  <span className={styles.count}>
    {value > max ? `${max}+` : value}
  </span>
);

export const Badge = Object.assign(BadgeRoot, {
  Dot: BadgeDot,
  Label: BadgeLabel,
  Count: BadgeCount,
});
