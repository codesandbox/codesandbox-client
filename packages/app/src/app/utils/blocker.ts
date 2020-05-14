/**
 * This is a waiting promise that only resolves when the given value is done
 * initializing. It waits.
 */
export type Blocker<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (value: T) => void;
  isFinished: () => boolean;
};

export function blocker<T>(): Blocker<T> {
  let resolve: (value: any) => void;
  let reject: (value: any) => void;
  let isFinished = false;

  const promise = new Promise<T>((success, error) => {
    resolve = success;
    reject = error;
  });

  return {
    promise,
    resolve: (payload: T) => {
      if (isFinished) {
        return;
      }

      isFinished = true;
      resolve(payload);
    },
    reject: (payload: any) => {
      if (isFinished) {
        return;
      }

      isFinished = true;
      reject(payload);
    },
    isFinished: () => isFinished,
  };
}
