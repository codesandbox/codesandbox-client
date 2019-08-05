import React, { useEffect, useState, useContext } from 'react';
import { initialize } from 'react-devtools-inline/frontend';
import { ThemeContext } from 'styled-components';

import { Container } from './elements';
import { DevToolProps } from '..';

const DevTools = (props: DevToolProps) => {
  const [ReactDevTools, setDevTools] = useState(null);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    const iframe = document.getElementById(
      'sandbox-preview'
    ) as HTMLIFrameElement;
    const contentWindow = iframe.contentWindow;
    // in the effect
    setDevTools(initialize(contentWindow));
    iframe.onload = () => {
      contentWindow.postMessage(
        {
          type: 'activate',
        },
        '*'
      );
    };
  }, []);

  if (props.hidden) {
    return null;
  }

  const browserTheme = theme.light ? 'light' : 'dark';

  return (
    <Container>
      {ReactDevTools && <ReactDevTools browserTheme={browserTheme} />}
    </Container>
  );
};

export default {
  id: 'codesandbox.react-devtools',
  title: '⚛ Components',
  Content: DevTools,
  actions: [],
};
