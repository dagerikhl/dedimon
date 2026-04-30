import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import cz from "classnames";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { getDefinedString } from "@/common/utils/general/getDefinedString";
import styles from "./Button.module.css";

export type IButtonVariant = "default" | "accent" | "success" | "error";

export interface IButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: IButtonVariant;
  icon?: IconProp;
  iconProps?: FontAwesomeIconProps;
}

export const Button = ({
  className,
  variant = "default",
  icon,
  iconProps,
  children,
  ...rest
}: IButtonProps) => (
  <button
    className={cz(className, styles.button, styles[variant])}
    title={getDefinedString(children)}
    {...rest}
  >
    {children} {icon && <FontAwesomeIcon icon={icon} {...iconProps} />}
  </button>
);
