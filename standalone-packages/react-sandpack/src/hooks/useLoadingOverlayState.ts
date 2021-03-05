import * as React from 'react';
import { useSandpack } from './useSandpack';

export type LoadingOverlayState = 'visible' | 'fading' | 'hidden';

export const useLoadingOverlayState = (): LoadingOverlayState => {
  const { sandpack, listen } = useSandpack();
  const [loadingOverlayState, setLoadingOverlayState] = React.useState<
    LoadingOverlayState
  >('visible');

  React.useEffect(() => {
    sandpack.loadingScreenRegisteredRef.current = true;

    const unsub = listen((message: any) => {
      if (message.type === 'refresh') {
        // Instant loading state when you refresh
        setLoadingOverlayState('visible');
      }

      if (message.type === 'start' && message.firstLoad === true) {
        setLoadingOverlayState('visible');
      }

      if (message.type === 'done') {
        setLoadingOverlayState('fading');
        setTimeout(() => setLoadingOverlayState('hidden'), 500); // fade animation
      }
    });

    return () => unsub();
  }, []);

  if (sandpack.status !== 'running') {
    return 'hidden';
  }

  return loadingOverlayState;
};
