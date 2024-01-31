import cz from "classnames";
import { DetailedHTMLProps, HTMLProps } from "react";
import styles from "./Dl.module.scss";

export interface IDlProps
  extends DetailedHTMLProps<HTMLProps<HTMLDListElement>, HTMLDListElement> {}

export const Dl = ({ className, children, ...rest }: IDlProps) => (
  <dl className={cz(className, styles.container)} {...rest}>
    {children}
  </dl>
);
