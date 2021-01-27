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
  const { sandpack } = useSandpack();

  // TODO: does resize from sandpack work?
  // React.useEffect(() => {
  //   const unsub = listen((message: any) => {
  //     if (message.type === 'resize') {
  //       if (wrapperRef.current) {
  //         wrapperRef.current.style.height =
  //           message.height + (showNavigator ? 40 : 0) + 'px';
  //       }
  //     }
  //   });

  //   return () => unsub();
  // }, [sandpack.status]);

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
        {sandpack.errors.length > 0 && (
          <div className="sp-error">{sandpack.errors[0].message}</div>
        )}
      </div>
    </div>
  );
};
