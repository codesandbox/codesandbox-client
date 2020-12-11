import { listen } from 'codesandbox-api';
import React from 'react';
import { SandpackContext } from '../utils/sandpack-context';

export interface PreviewProps {
  style?: React.CSSProperties;
}

export const Preview: React.FC<PreviewProps> = props => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sandpack = React.useContext(SandpackContext);

  // TODO: is this still needed?
  React.useEffect(() => {
    listen((message: any) => {
      if (!sandpack) {
        return;
      }

      if (message.type === 'resize') {
        if (sandpack.browserFrame) {
          sandpack.browserFrame.style.height = message.height;
        }
      }
    });
  }, []);

  React.useEffect(() => {
    if (!sandpack || !sandpack.browserFrame || !containerRef.current) {
      return;
    }

    const { browserFrame } = sandpack;
    browserFrame.style.width = '100%';
    browserFrame.style.height = '500px';
    browserFrame.style.visibility = 'visible';
    browserFrame.style.position = 'relative';

    containerRef.current.appendChild(browserFrame);
  }, [sandpack?.browserFrame]);

  return <div style={props.style} ref={containerRef} />;
};
