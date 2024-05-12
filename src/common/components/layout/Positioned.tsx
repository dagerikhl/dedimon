import cz from "classnames";
import { ReactNode } from "react";
import styles from "./Positioned.module.scss";

export type IPosition =
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left"
  | "center";

export interface IPositionedProps {
  className?: string;
  position: IPosition;
  children?: ReactNode;
}

export const Positioned = ({
  className,
  position,
  children,
}: IPositionedProps) => (
  <div className={styles.container}>
    <div className={cz(className, styles.content, styles[position])}>
      {children}
    </div>
  </div>
);
