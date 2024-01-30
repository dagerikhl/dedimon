import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cz from "classnames";
import { ReactNode } from "react";
import styles from "./Loader.module.scss";

export interface ILoaderProps {
  isLoading?: boolean;
  children?: ReactNode;
}

export const Loader = ({ isLoading, children }: ILoaderProps) => {
  return (
    <div className={cz(styles.container, { [styles.isLoading]: isLoading })}>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <FontAwesomeIcon icon={faSpinner} size="xl" spinPulse />

        {children}
      </div>
    </div>
  );
};
