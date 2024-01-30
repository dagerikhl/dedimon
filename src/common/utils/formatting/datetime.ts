import { format, formatDuration, intervalToDuration } from "date-fns";

type IDateType = number | string | Date;

export const formatDatetime = (
  date: IDateType,
  includeSeconds?: boolean,
): string => format(date, `yyyy-MM-dd HH:mm${includeSeconds ? ":ss" : ""}`);

export const formatUptime = (start: IDateType, end: IDateType): string =>
  formatDuration(intervalToDuration({ start, end }), {
    format: ["months", "weeks", "days", "hours", "minutes"],
    zero: true,
    delimiter: ", ",
  });
