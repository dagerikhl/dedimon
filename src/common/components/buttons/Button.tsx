import { whenDefined } from "@/common/utils/general/whenDefined";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import cz from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./Button.module.scss";

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
    title={whenDefined<string>(children as any, "string")}
    {...rest}
  >
    {children} {icon && <FontAwesomeIcon icon={icon} {...iconProps} />}
  </button>
);
