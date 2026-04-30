import cz from "classnames";
import type { DetailedHTMLProps, HTMLProps } from "react";
import styles from "./Dl.module.css";

export interface IDlProps
  extends DetailedHTMLProps<HTMLProps<HTMLDListElement>, HTMLDListElement> {}

export const Dl = ({ className, children, ...rest }: IDlProps) => (
  <dl className={cz(className, styles.container)} {...rest}>
    {children}
  </dl>
);
