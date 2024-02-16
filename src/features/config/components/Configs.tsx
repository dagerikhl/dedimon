"use client";

import { Button } from "@/common/components/buttons/Button";
import { Loader } from "@/common/components/layout/Loader";
import {
  Config,
  IOnConfigChange,
  IOnConfigError,
} from "@/features/config/components/Config";
import {
  faCancel,
  faEdit,
  faRefresh,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import axios, { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import styles from "./Configs.module.scss";

export const Configs = <T extends Record<string, any>>() => {
  const [isLoading, setIsLoading] = useState(false);

  const [configs, setConfigs] = useState<Record<string, string> | undefined>(
    undefined,
  );
  const [editedConfig, setEditedConfig] = useState<
    Record<string, string> | undefined
  >(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const hasErrors = Object.values(errors).filter((x) => !!x).length > 0;

  const getConfigs = useCallback(() => {
    setIsLoading(true);
    axios
      .get<Record<string, string>>("/api/server/configs")
      .then((res) => {
        setConfigs(res.data);
        setEditedConfig(res.data);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getConfigs();
  }, [getConfigs]);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditedConfig(configs);
    setIsEditing(false);
    setErrors({});
  };

  const handleSaveConfig = async () => {
    if (!editedConfig) {
      return;
    }

    setIsLoading(true);
    axios
      .post<void, AxiosResponse<void>, Record<string, string>>(
        "/api/server/configs",
        editedConfig,
      )
      .then(() => {
        getConfigs();
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
        setIsEditing(false);
      });
  };

  const handleRefreshConfig = () => {
    getConfigs();
  };

  const handleConfigChange: IOnConfigChange = (key, value) => {
    setEditedConfig((current) => ({ ...current, [key]: value }));
    setErrors({});
  };

  const handleConfigError: IOnConfigError = (key, error) => {
    setErrors((current) => ({ ...current, [key]: error }));
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
              disabled={!isEditing || hasErrors}
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

        {editedConfig &&
          Object.entries(editedConfig).map(([configPath, config]) => (
            <Config
              key={configPath}
              path={configPath}
              value={config}
              disabled={isLoading || !isEditing}
              error={errors[configPath]}
              onChange={handleConfigChange}
              onError={handleConfigError}
            />
          ))}
      </div>

      <Loader isLoading={isLoading} />
    </>
  );
};
