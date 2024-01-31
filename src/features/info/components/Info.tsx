"use client";

import { Dl } from "@/common/components/layout/Dl";
import { Loader } from "@/common/components/layout/Loader";
import { camelCaseToTitleCase } from "@/common/utils/formatting/text";
import { useApiServerState } from "@/features/api/state/hooks/useApiServerState";
import { Fragment } from "react";

export const Info = () => {
  const state = useApiServerState();

  return (
    <>
      {state.info && Object.keys(state.info).length > 0 ? (
        <Dl>
          {Object.entries(state.info).map(([key, value]) => (
            <Fragment key={key}>
              <dt>{camelCaseToTitleCase(key)}:</dt>
              <dl>{typeof value === "string" ? `"${value}"` : value}</dl>
            </Fragment>
          ))}
        </Dl>
      ) : (
        "-"
      )}

      <Loader isLoading={state.status === "offline"} />
    </>
  );
};
