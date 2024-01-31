"use client";

import { Button } from "@/common/components/buttons/Button";
import { Loader } from "@/common/components/layout/Loader";
import { IApiServerConfig } from "@/features/config/types/IApiServerConfig";
import {
  parseConfig,
  stringifyConfig,
} from "@/features/config/utils/serialization";
import {
  faCancel,
  faEdit,
  faRefresh,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import axios, { AxiosResponse } from "axios";
import cz from "classnames";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import styles from "./Config.module.scss";

export interface IConfigProps<T extends Record<string, any>> {}

export const Config = <T extends Record<string, any>>({}: IConfigProps<T>) => {
  const [isLoading, setIsLoading] = useState(false);

  const [config, setConfig] = useState<IApiServerConfig<T> | undefined>(
    undefined,
  );
  const [editedConfig, setEditedConfig] = useState<string | undefined>(
    undefined,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const getConfig = useCallback(() => {
    setIsLoading(true);
    axios
      .get<IApiServerConfig<T>>("/api/server/config")
      .then((res) => {
        setConfig(res.data);
        setEditedConfig(stringifyConfig(res.data));
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getConfig();
  }, [getConfig]);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditedConfig(config ? stringifyConfig(config) : undefined);
    setIsEditing(false);
    setError(undefined);
  };

  const handleSaveConfig = async () => {
    if (!editedConfig) {
      return;
    }

    let payload: IApiServerConfig<T>;
    try {
      payload = parseConfig(editedConfig);
    } catch (e) {
      console.error(e);

      setError(`Invalid JSON: ${(e as Error).message}`);

      return;
    }

    setIsLoading(true);
    axios
      .post<void, AxiosResponse<void>, IApiServerConfig<T>>(
        "/api/server/config",
        payload,
      )
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
        setIsEditing(false);
      });
  };

  const handleRefreshConfig = () => {
    getConfig();
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedConfig(e.target.value);
    setError(undefined);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <Button
              variant="accent"
              icon={faEdit}
              disabled={isLoading || isEditing}
              onClick={handleStartEditing}
            >
              Edit
            </Button>

            <Button
              variant="success"
              icon={faSave}
              disabled={!isEditing}
              onClick={handleSaveConfig}
            >
              Save
            </Button>

            <Button
              variant="error"
              icon={faCancel}
              disabled={!isEditing}
              onClick={handleCancelEditing}
            >
              Cancel
            </Button>
          </div>

          <div className={styles.controlGroup}>
            <Button
              icon={faRefresh}
              disabled={isLoading || isEditing}
              onClick={handleRefreshConfig}
            >
              Refresh
            </Button>
          </div>
        </div>

        <textarea
          className={cz(styles.editor, { [styles.editorError]: !!error })}
          disabled={isLoading || !isEditing}
          value={editedConfig}
          onChange={handleChange}
        />

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <Loader isLoading={isLoading} />
    </>
  );
};
