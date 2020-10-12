import { IDisposable } from 'inspector/lib/common/rpc/disposable';
import { useEffect } from 'react';

type Callback = (toDispose: IDisposable[]) => (() => void) | void;

export function useDisposableEffect(
  callback: Callback,
  dependencyArray: ReadonlyArray<unknown>
) {
  useEffect(() => {
    const toDispose: IDisposable[] = [];
    const cleanup = callback(toDispose);

    return () => {
      toDispose.forEach(dis => dis.dispose());
      if (cleanup) {
        cleanup();
      }
    };
  }, dependencyArray);
}
