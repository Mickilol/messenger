export function debounce(fn: Function, ms: number) {
  let timeout: Nullable<number> = null;

  return function (...args: unknown[]) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}