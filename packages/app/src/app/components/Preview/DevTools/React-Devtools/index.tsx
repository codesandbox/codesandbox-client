import React, { useEffect, useRef, useState } from 'react';
import { initialize } from 'react-devtools-inline/frontend';

import { Container } from './elements';
import { DevToolProps } from '..';

const DevTools = (props: DevToolProps) => {
  const [devToolsReady, setDtReady] = useState(false);
  const [ReactDevTools, setDevTools] = useState(null);

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
    setDtReady(true);
  }, []);

  if (props.hidden) {
    return null;
  }

  return (
    <Container>{devToolsReady && ReactDevTools && <ReactDevTools />}</Container>
  );
};

export default {
  id: 'codesandbox.react-devtools',
  title: '⚛️ Components',
  Content: DevTools,
  actions: [],
};
