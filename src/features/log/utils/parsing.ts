const LOG_LINE_WITH_TIMESTAMP_RE = /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?]/;

export const getLogLineParts = (line: string): [string | undefined, string] => {
  if (LOG_LINE_WITH_TIMESTAMP_RE.test(line)) {
    return [line.slice(1, 20), line.slice(22)];
  }

  return [undefined, line];
};
