import { Button, IButtonProps } from "@/common/components/buttons/Button";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

export interface ICopyButtonProps extends IButtonProps {
  children?: ReactNode;
}

export const CopyButton = ({
  title = "Copy to clipboard",
  children,
  ...rest
}: ICopyButtonProps) => (
  <Button title={title} {...rest}>
    <FontAwesomeIcon icon={faCopy} />
  </Button>
);
