/**
 * This is a waiting promise that only resolves when the given value is done
 * initializing. It waits.
 */
export type Blocker<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

export function blocker<T>(): Blocker<T> {
  let resolve: (value: T) => void = null;
  const promise = new Promise<T>(r => {
    resolve = r;
  });

  return {
    promise,
    resolve,
  };
}
