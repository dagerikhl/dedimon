import {
  addMinutes,
  format,
  formatDuration,
  intervalToDuration,
} from "date-fns";

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

export const getMinuteMark = (date: IDateType, offset?: number): string => {
  const minuteMarkFormat = "yyyy-MM-dd HH:mm";

  if (offset) {
    return format(addMinutes(date, offset), minuteMarkFormat);
  }

  return format(date, minuteMarkFormat);
};
