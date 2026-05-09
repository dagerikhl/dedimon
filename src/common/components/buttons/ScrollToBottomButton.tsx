import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";
import { Button, type IButtonProps } from "@/common/components/buttons/Button";

export interface IScrollToBottomButtonProps extends IButtonProps {
  children?: ReactNode;
}

export const ScrollToBottomButton = ({
  title = "Scroll to bottom",
  children,
  ...rest
}: IScrollToBottomButtonProps) => (
  <Button title={title} {...rest}>
    <FontAwesomeIcon icon={faAnglesDown} />
  </Button>
);
