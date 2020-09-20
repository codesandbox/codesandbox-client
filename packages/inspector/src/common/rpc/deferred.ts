/**
 * Simple implementation of the deferred pattern.
 * An object that exposes a promise and functions to resolve and reject it.
 */
export class Deferred<T> {
  // @ts-ignore
  resolve: (value?: T) => void;
  // @ts-ignore
  reject: (err?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

  promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}
