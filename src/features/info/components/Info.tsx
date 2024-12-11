"use client";

import { Dl } from "@/common/components/layout/Dl";
import { Loader } from "@/common/components/layout/Loader";
import { camelCaseToTitleCase } from "@/common/utils/formatting/text";
import { useApiServerState } from "@/features/api/state/hooks/useApiServerState";
import { Fragment } from "react";

const checkIsPrintable = (value: any): boolean =>
  !value ||
  typeof value === "boolean" ||
  typeof value === "number" ||
  typeof value === "string";

export const Info = <T extends Record<string, any>>() => {
  const state = useApiServerState();

  return (
    <>
      {state.info && Object.keys(state.info).length > 0 ? (
        <Dl>
          {Object.entries(state.info)
            .filter(([, value]) => checkIsPrintable(value))
            .map(([key, value]) => (
              <Fragment key={key}>
                <dt>{camelCaseToTitleCase(key)}:</dt>
                <dl title={`Type: ${typeof value}`}>{value}</dl>
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
