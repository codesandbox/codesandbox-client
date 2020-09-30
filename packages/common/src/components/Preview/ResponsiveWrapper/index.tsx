import { Element, Stack, Button, ThemeProvider } from '@codesandbox/components';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Styled = styled<{ width: string; height: string }>(Element)`
  height: 100%;

  > div {
    margin: auto;
    background: black;
    height: 100%;
    position: relative;
  }

  iframe {
    width: ${props => props.width};
    height: ${props => props.height};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: block;
  }
`;

export const ResponsiveWrapper = ({ on, actions, children }) => {
  const [width, setWidth] = useState<string>('100%');
  const [height, setHeight] = useState<string>('100%');
  const defaultWidth =
    document.getElementById('sandbox-preview')?.clientWidth + 'px';
  const defaultHeight =
    document.getElementById('sandbox-preview')?.clientHeight + 'px';

  useEffect(() => {
    setWidth(defaultWidth);
    setHeight(defaultHeight);
  }, []);

  if (!on) return children;

  const setBreakpoint = ([w, h]) => {
    setWidth(w + 'px');
    setHeight(h + 'px');
  };

  const removeBreakpoints = () => {
    setWidth('100%');
    setHeight('100%');
  };

  return (
    <ThemeProvider>
      <Element>
        <Stack>
          <Button
            autoWidth
            variant="secondary"
            onClick={() => setBreakpoint([320, 675])}
          >
            Mobile
          </Button>
          <Button autoWidth variant="secondary" onClick={removeBreakpoints}>
            Remove All
          </Button>
        </Stack>
      </Element>
      <Styled width={width} height={height}>
        <div>{children}</div>
      </Styled>
    </ThemeProvider>
  );
};
