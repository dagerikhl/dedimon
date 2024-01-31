import cz from "classnames";
import { DetailedHTMLProps, forwardRef, HTMLProps } from "react";
import styles from "./Code.module.scss";

export interface ICodeProps
  extends Omit<DetailedHTMLProps<HTMLProps<HTMLElement>, HTMLElement>, "ref"> {}

export const Code = forwardRef<HTMLElement, ICodeProps>(
  ({ className, children, ...rest }, ref) => (
    <code ref={ref} className={cz(className, styles.container)} {...rest}>
      {children}
    </code>
  ),
);
Code.displayName = "Code";
