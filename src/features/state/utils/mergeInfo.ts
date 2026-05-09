import type { IApiServerStateInfo } from "@/features/state/types/IApiServerStateInfo";

export const mergeInfo = <Info extends Record<string, any>>(
  info: IApiServerStateInfo<Info> | undefined,
  newInfo: Partial<IApiServerStateInfo<Info>>,
): IApiServerStateInfo<Info> | undefined => {
  const mergedInfo: IApiServerStateInfo<Info> = {
    ...info,
  } as IApiServerStateInfo<Info>;

  for (const [key, value] of Object.entries(newInfo)) {
    if (value === null || value === undefined) {
      continue;
    }

    mergedInfo[key as keyof IApiServerStateInfo<Info>] = value;
  }

  if (
    Object.values(mergedInfo).filter((x) => x !== null && x !== undefined)
      .length === 0
  ) {
    return undefined;
  }

  return mergedInfo;
};
