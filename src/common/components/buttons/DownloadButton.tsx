import { Button, IButtonProps } from "@/common/components/buttons/Button";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

export interface IDownloadButtonProps extends IButtonProps {
  children?: ReactNode;
}

export const DownloadButton = ({
  title = "Download",
  children,
  ...rest
}: IDownloadButtonProps) => (
  <Button title={title} {...rest}>
    <FontAwesomeIcon icon={faDownload} />
  </Button>
);
