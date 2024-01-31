import { formatDatetime } from "@/common/utils/formatting/datetime";

export const getTimestamp = () => `[${formatDatetime(new Date(), true)}]`;

export const LOGGER = {
  info: (...data: any[]) => {
    console.log(getTimestamp(), "[INF]", ...data);
  },
  warn: (...data: any[]) => {
    console.warn(getTimestamp(), "[WRN]", ...data);
  },
  error: (...data: any[]) => {
    console.error(getTimestamp(), "[ERR]", ...data);
  },
};
