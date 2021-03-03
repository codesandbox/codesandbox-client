import * as React from 'react';

import { useSandpack } from '../../hooks/useSandpack';
import { Navigator } from '../Navigator';
import { LoadingAnimation } from './LoadingAnimation';
import { OpenInCodeSandboxButton } from './OpenInCodeSandboxButton';
import { RefreshButton } from './RefreshButton';

export type PreviewOptions = {
  showNavigator?: boolean;
};

export type PreviewProps = PreviewOptions & {
  customStyle?: React.CSSProperties;
  showOpenInCodeSandbox?: boolean;
  showRefreshButton?: boolean;
  showSandpackErrorOverlay?: boolean;
};

export { RefreshButton, OpenInCodeSandboxButton };

export const SandpackPreview: React.FC<PreviewProps> = ({
  customStyle,
  showNavigator = false,
  showRefreshButton = true,
  showOpenInCodeSandbox = true,
  showSandpackErrorOverlay = true,
}) => {
  const { sandpack, listen } = useSandpack();
  const [loadingOverlayState, setLoadingOverlayState] = React.useState<
    'visible' | 'fading' | 'hidden'
  >('visible');

  const {
    status,
    error,
    iframeRef,
    errorScreenRegisteredRef,
    loadingScreenRegisteredRef,
  } = sandpack;

  React.useEffect(() => {
    // The Preview component will take care of displaying the error and the loading screen
    errorScreenRegisteredRef.current = true;
    loadingScreenRegisteredRef.current = true;

    const unsub = listen((message: any) => {
      if (message.type === 'start' && message.firstLoad === true) {
        setLoadingOverlayState('visible');
      }

      if (message.type === 'done') {
        setLoadingOverlayState('fading');
        setTimeout(() => setLoadingOverlayState('hidden'), 500); // 300 ms animation
      }

      if (message.type === 'resize' && iframeRef.current) {
        iframeRef.current.style.height = `${message.height}px`;
      }
    });

    return () => unsub();
  }, []);

  return (
    <div
      className="sp-stack"
      style={{
        ...customStyle,
        display: status !== 'idle' ? 'flex' : 'none',
      }}
    >
      {showNavigator && <Navigator />}

      <div className="sp-preview-container">
        <iframe
          className="sp-preview-iframe"
          ref={iframeRef}
          title="Sandpack Preview"
        />
        {showSandpackErrorOverlay && error && (
          <div className="sp-overlay sp-error">
            <div className="sp-error-message">{error.message}</div>
          </div>
        )}

        <div className="sp-preview-actions">
          {!showNavigator && showRefreshButton && status === 'running' && (
            <RefreshButton />
          )}

          {showOpenInCodeSandbox && <OpenInCodeSandboxButton />}
        </div>

        {status === 'running' && (
          <LoadingAnimation loadingOverlayState={loadingOverlayState} />
        )}
      </div>
    </div>
  );
};
