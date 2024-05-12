import { Button, IButtonProps } from "@/common/components/buttons/Button";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

export interface IDownloadButtonProps extends IButtonProps {
  name?: string;
  children?: ReactNode;
}

export const DownloadButton = ({
  name,
  title,
  children,
  ...rest
}: IDownloadButtonProps) => (
  <Button title={name && !title ? `Download ${name}` : title} {...rest}>
    <FontAwesomeIcon icon={faDownload} />
  </Button>
);
