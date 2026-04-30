import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";
import { Button, type IButtonProps } from "@/common/components/buttons/Button";

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
