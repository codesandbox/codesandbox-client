import React, { useEffect, useRef, useState } from 'react';
import { initialize } from 'react-devtools-inline/frontend';

import { Container } from './elements';

const DevTools = () => {
  const ReactDevTools = useRef(null);
  const [devToolsReady, setDtReady] = useState(false);

  useEffect(() => {
    const iframe = document.getElementById(
      'sandbox-preview'
    ) as HTMLIFrameElement;
    const contentWindow = iframe.contentWindow;
    ReactDevTools.current = initialize(contentWindow);
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

  return (
    <Container>
      {devToolsReady && ReactDevTools.current && <ReactDevTools.current />}
    </Container>
  );
};

export default {
  id: 'codesandbox.devtools',
  title: 'React DevTools',
  Content: DevTools,
  actions: [],
};
