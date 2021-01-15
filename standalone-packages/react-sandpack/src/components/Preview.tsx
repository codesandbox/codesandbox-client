import * as React from 'react';
import { ErrorMessage } from '../elements';
import { styled } from '../stitches.config';

import { useSandpack } from '../utils/sandpack-context';
import { Navigator } from './Navigator';

export interface PreviewProps {
  customStyle?: React.CSSProperties;
  showNavigator?: boolean;
}

// const translate = css.keyframes({
//   '0%': { maxWidth: 0 },
//   '100%': { maxWidth: '100%' },
// });

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  border: '1px solid $inactive',
  margin: -1,
  // animationName: translate,
  // animationDuration: '0.5s',
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
  }, [sandpack.status]);

  React.useEffect(() => {
    if (
      !sandpack.browserFrame ||
      !containerRef.current ||
      sandpack.status !== 'running'
    ) {
      return;
    }

    const { browserFrame } = sandpack;
    browserFrame.style.width = '100%';
    browserFrame.style.height = '100%';
    browserFrame.style.visibility = 'visible';
    browserFrame.style.position = 'relative';

    containerRef.current.appendChild(browserFrame);
  }, [sandpack?.browserFrame, sandpack.status]);

  if (sandpack.status !== 'running') {
    return null;
  }

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
