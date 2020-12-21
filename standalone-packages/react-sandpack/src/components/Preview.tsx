import { listen } from 'codesandbox-api';
import React, { useRef, useEffect } from 'react';

import { useSandpack } from '../utils/sandpack-context';
import { Navigator } from './Navigator';

export interface PreviewProps {
  style?: React.CSSProperties;
  showNavigator?: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ style, showNavigator }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sandpack = useSandpack();

  // TODO: is this still needed?
  useEffect(() => {
    const unsub = listen((message: any) => {
      if (message.type === 'resize') {
        if (sandpack.browserFrame) {
          sandpack.browserFrame.style.height = message.height;
        }
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (!sandpack.browserFrame || !containerRef.current) {
      return;
    }

    const { browserFrame } = sandpack;
    browserFrame.style.width = '100%';
    browserFrame.style.height = '500px';
    browserFrame.style.visibility = 'visible';
    browserFrame.style.position = 'relative';

    containerRef.current.appendChild(browserFrame);
  }, [sandpack?.browserFrame]);

  return (
    <>
      {showNavigator && <Navigator />}
      <div style={style} ref={containerRef} />
    </>
  );
};
