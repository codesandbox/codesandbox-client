/**
 * This is a waiting promise that only resolves when the given value is done
 * initializing. It waits.
 */
export type Blocker<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  isResolved: () => boolean;
};

export function blocker<T>(): Blocker<T> {
  let resolve: (value: T) => void = null;
  let isResolved = false;
  const promise = new Promise<T>(r => {
    resolve = r;
  });

  return {
    promise,
    resolve: (payload: T) => {
      if (isResolved) {
        return;
      }

      isResolved = true;
      resolve(payload);
    },
    isResolved: () => isResolved,
  };
}
