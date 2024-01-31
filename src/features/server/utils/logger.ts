import { formatDatetime } from "@/common/utils/formatting/datetime";

const getTimestamp = () => `[${formatDatetime(new Date())}]`;

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
