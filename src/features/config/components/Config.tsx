import { Code } from "@/common/components/formatting/Code";
import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import { parseConfig } from "@/features/config/utils/serialization";
import cz from "classnames";
import { ChangeEvent } from "react";
import styles from "./Config.module.scss";

const ADAPTER = ADAPTERS[process.env.NEXT_PUBLIC_ADAPTER];

export type IOnConfigChange = (key: string, value: string) => void;
export type IOnConfigError = (key: string, error: string | undefined) => void;

export interface IConfigProps {
  path: string;
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: IOnConfigChange;
  onError: IOnConfigError;
}

export const Config = ({
  disabled,
  path,
  value,
  error,
  onChange,
  onError,
}: IConfigProps) => {
  const name = path.slice(path.lastIndexOf("\\")).slice(1);

  const configSpec =
    ADAPTER.configSpecs[name as keyof typeof ADAPTER.configSpecs];

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(path, e.target.value);

    try {
      parseConfig(e.target.value, configSpec);
    } catch (e) {
      const error = `Invalid config: ${(e as Error).message}`;

      console.error(e);
      onError(path, error);
    }
  };

  return (
    <>
      <label className={styles.editorContainer}>
        <Code>{name}:</Code>

        <textarea
          className={cz(styles.editor, { [styles.editorError]: !!error })}
          disabled={disabled}
          value={value}
          onChange={handleChange}
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}
    </>
  );
};
