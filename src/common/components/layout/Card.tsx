import cz from "classnames";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.scss";

export interface ICardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  heading?: ReactNode;
  noPadding?: boolean;
}

export const Card = ({
  className,
  heading,
  noPadding,
  children,
  ...rest
}: ICardProps) => (
  <section className={cz(className, styles.container)} {...rest}>
    {heading && <div className={styles.heading}>{heading}</div>}

    <div className={cz(styles.content, { [styles.padding]: !noPadding })}>
      {children}
    </div>
  </section>
);
