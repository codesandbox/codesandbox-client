import React, { useEffect, useRef, Component, useState } from 'react';
import { initialize } from 'react-devtools-inline/frontend';

import { Container } from './elements';

interface Props {
  hidden: boolean;
}

const DevTools = ({ hidden }: Props) => {
  const ReactDevTools = useRef<Component<any, any> | null>(null);
  const [devToolsReady, setDtReady] = useState(false);

  useEffect(() => {
    const iframe = (document.getElementById(
      'sandbox-preview'
    ) as any) as HTMLIFrameElement;
    const contentWindow = iframe.contentWindow;
    ReactDevTools.current = initialize(contentWindow);
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
