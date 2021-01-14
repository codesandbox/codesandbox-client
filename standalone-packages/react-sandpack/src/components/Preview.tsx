import * as React from 'react';
import { ErrorMessage } from '../elements';
import { styled } from '../stitches.config';

import { useSandpack } from '../utils/sandpack-context';
import { Navigator } from './Navigator';

export interface PreviewProps {
  customStyle?: React.CSSProperties;
  showNavigator?: boolean;
}

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  border: '1px solid $inactive',
  margin: -1,
});

const PreviewFrame = styled('div', {
  width: '100%',
  flex: 1,
  position: 'relative',
});

export const Preview: React.FC<PreviewProps> = ({
  customStyle,
  showNavigator,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { sandpack, listen } = useSandpack();

  // TODO: is this still needed?
  React.useEffect(() => {
    const unsub = listen((message: any) => {
      if (message.type === 'resize') {
        if (sandpack.browserFrame) {
          sandpack.browserFrame.style.height = message.height;
        }
      }
    });

    return () => unsub();
  }, []);

  React.useEffect(() => {
    if (!sandpack.browserFrame || !containerRef.current) {
      return;
    }

    const { browserFrame } = sandpack;
    browserFrame.style.width = '100%';
    browserFrame.style.height = '100%';
    browserFrame.style.visibility = 'visible';
    browserFrame.style.position = 'relative';

    containerRef.current.appendChild(browserFrame);
  }, [sandpack?.browserFrame]);

  return (
    <Wrapper style={customStyle}>
      {showNavigator && <Navigator />}
      <PreviewFrame id="preview-frame" ref={containerRef}>
        {sandpack.errors.length > 0 && (
          <ErrorMessage>{sandpack.errors[0].message}</ErrorMessage>
        )}
      </PreviewFrame>
    </Wrapper>
  );
};
