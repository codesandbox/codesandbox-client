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
};

export { RefreshButton, OpenInCodeSandboxButton };

export const Preview: React.FC<PreviewProps> = ({
  customStyle,
  showNavigator = false,
  showRefreshButton = true,
  showOpenInCodeSandbox = true,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { sandpack, listen } = useSandpack();
  const [loadingOverlayState, setLoadingOverlayState] = React.useState<
    'visible' | 'fading' | 'hidden'
  >('visible');

  React.useEffect(() => {
    if (sandpack.status === 'idle') {
      return () => {}; // No listener attached while sandpack is not instantiated
    }

    const unsub = listen((message: any) => {
      if (message.type === 'start' && message.firstLoad === true) {
        setLoadingOverlayState('visible');
      }

      if (message.type === 'done') {
        setLoadingOverlayState('fading');
        setTimeout(() => setLoadingOverlayState('hidden'), 300); // 300 ms animation
      }
    });

    return () => unsub();
  }, [sandpack?.browserFrame]);

  React.useEffect(() => {
    if (
      !sandpack.browserFrame ||
      !containerRef.current ||
      sandpack.status !== 'running'
    ) {
      return;
    }

    const { browserFrame } = sandpack;
    browserFrame.style.width = 'auto';
    browserFrame.style.height = 'auto';
    browserFrame.style.flex = '1';
    browserFrame.style.visibility = 'visible';
    browserFrame.style.position = 'relative';

    containerRef.current.appendChild(browserFrame);
  }, [sandpack?.browserFrame, sandpack.status]);

  if (sandpack.status !== 'running') {
    return null;
  }

  return (
    <div className="sp-stack" style={customStyle} ref={wrapperRef}>
      {showNavigator && <Navigator />}

      <div className="sp-preview-frame" id="preview-frame" ref={containerRef}>
        {sandpack.error && (
          <div className="sp-overlay sp-error">
            <div className="sp-error-message">{sandpack.error.message}</div>
          </div>
        )}

        {!showNavigator && showRefreshButton && (
          <RefreshButton
            customStyle={{
              position: 'absolute',
              bottom: 'var(--sp-space-2)',
              left: 'var(--sp-space-2)',
              zIndex: 4,
            }}
          />
        )}

        {showOpenInCodeSandbox && (
          <OpenInCodeSandboxButton
            customStyle={{
              position: 'absolute',
              bottom: 'var(--sp-space-2)',
              right: 'var(--sp-space-2)',
              zIndex: 4,
            }}
          />
        )}

        <LoadingAnimation loadingOverlayState={loadingOverlayState} />
      </div>
    </div>
  );
};
