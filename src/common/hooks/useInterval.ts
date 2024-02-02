import { useEffect } from "react";

export const useInterval = (
  cb: VoidFunction,
  delay: number | null,
  immediate?: boolean,
) => {
  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(cb, delay);

    if (immediate) {
      cb();
    }

    return () => {
      clearInterval(id);
    };
  }, [cb, delay, immediate]);
};
