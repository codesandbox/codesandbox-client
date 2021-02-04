import * as React from 'react';

import { useSandpack } from '../utils/sandpack-context';
import { Navigator } from './Navigator';

export interface PreviewProps {
  customStyle?: React.CSSProperties;
  showNavigator?: boolean;
}

export const Preview: React.FC<PreviewProps> = ({
  customStyle,
  showNavigator,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { sandpack, listen } = useSandpack();
  const [loadingOverlay, setLoadingOverlay] = React.useState<
    'visible' | 'fading' | 'hidden'
  >('visible');

  React.useEffect(() => {
    const unsub = listen((message: any) => {
      if (message.type === 'start' && message.firstLoad === true) {
        setLoadingOverlay('visible');
      }

      if (message.type === 'done') {
        setLoadingOverlay('fading');
        setTimeout(() => setLoadingOverlay('hidden'), 300); // 300 ms animation
      }

      // TODO: does resize from sandpack work?
      // if (message.type === 'resize') {
      //   if (wrapperRef.current) {
      //     wrapperRef.current.style.height =
      //       message.height + (showNavigator ? 40 : 0) + 'px';
      //   }
      // }
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
    <div style={customStyle} ref={wrapperRef}>
      {showNavigator && <Navigator />}

      <div className="sp-preview-frame" id="preview-frame" ref={containerRef}>
        {loadingOverlay !== 'hidden' && (
          <div
            className="sp-overlay sp-loading"
            style={{
              opacity: loadingOverlay === 'visible' ? 1 : 0,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <div className="sp-cubes">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        )}

        {sandpack.error && (
          <div className="sp-overlay sp-error">{sandpack.error.message}</div>
        )}
      </div>
    </div>
  );
};
