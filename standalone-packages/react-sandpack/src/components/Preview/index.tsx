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

  React.useEffect(() => {
    const unsub = listen((message: any) => {
      if (message.type === 'start' && message.firstLoad === true) {
        setLoadingOverlayState('visible');
      }

      if (message.type === 'done') {
        setLoadingOverlayState('fading');
        setTimeout(() => setLoadingOverlayState('hidden'), 500); // 300 ms animation
      }

      // TODO: Check why the bundler sends the resize message so late
      // TODO: iframeContainerRef should not be changed probably because it messes up the position of the buttons
      // if (message.type === 'resize' && iframeContainerRef.current) {
      //   iframeContainerRef.current.style.minHeight = `${message.height}px`;
      // }
    });

    return () => unsub();
  }, []);

  const { status, error, iframeRef } = sandpack;

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
