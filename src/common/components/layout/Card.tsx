"use client";

import { Button } from "@/common/components/buttons/Button";
import { faMaximize, faMinimize } from "@fortawesome/free-solid-svg-icons";
import cz from "classnames";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useState,
} from "react";
import styles from "./Card.module.scss";

export interface ICardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  heading?: ReactNode;
  noPadding?: boolean;
  omitFullscreen?: boolean;
}

export const Card = ({
  className,
  heading,
  noPadding,
  omitFullscreen,
  children,
  ...rest
}: ICardProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    setIsFullscreen((current) => !current);
  };

  const handleEscape = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "Escape") {
      return;
    }

    setIsFullscreen(false);
  };

  return (
    <section
      className={cz(className, styles.container, {
        [styles["--fullscreen"]]: isFullscreen,
      })}
      {...rest}
    >
      <div className={styles.heading}>
        <div>{heading}</div>

        {omitFullscreen ? (
          <div />
        ) : (
          <Button
            icon={isFullscreen ? faMinimize : faMaximize}
            onClick={handleToggleFullscreen}
            onKeyUp={handleEscape}
          />
        )}
      </div>

      <div className={cz(styles.content, { [styles.padding]: !noPadding })}>
        {children}
      </div>
    </section>
  );
};
