import React, { useEffect, useState, useContext, useCallback } from 'react';
import delay from '@codesandbox/common/lib/utils/delay';
import { initialize } from 'react-devtools-inline/frontend';
import { dispatch, actions } from 'codesandbox-api';
import { ThemeContext } from 'styled-components';

import { Container } from './elements';
import { DevToolProps } from '..';

const DevTools = (props: DevToolProps) => {
  const [ReactDevTools, setDevTools] = useState(null);
  const theme = useContext(ThemeContext);
  const unmounted = React.useRef(false);

  const loadIframe = useCallback(async () => {
    let iframe = document.getElementById(
      'sandbox-preview'
    ) as HTMLIFrameElement;

    // iframe hasn't initialized or just isn't there
    while (iframe === null && !unmounted.current) {
      // Retry every second
      // eslint-disable-next-line
      await delay(1000);
      iframe = document.getElementById('sandbox-preview') as HTMLIFrameElement;
    }

    if (iframe) {
      const contentWindow = iframe.contentWindow;

      setDevTools(initialize(contentWindow));
      iframe.onload = () => {
        contentWindow.postMessage(
          {
            type: 'activate',
          },
          '*'
        );
      };
    }
  }, []);

  useEffect(() => {
    loadIframe();
    return () => {
      unmounted.current = true;
    };
  }, [loadIframe]);

  if (props.hidden) {
    return null;
  }

  const browserTheme = theme.light ? 'light' : 'dark';

  function viewElementSourceFunction(id: string, data: any) {
    const { source } = data;

    if (source) {
      dispatch(actions.editor.openModule(source.fileName, source.lineNumber));
    }
  }

  return (
    <Container>
      {ReactDevTools && (
        <ReactDevTools
          viewElementSourceFunction={viewElementSourceFunction}
          browserTheme={browserTheme}
        />
      )}
    </Container>
  );
};

export default {
  id: 'codesandbox.react-devtools',
  title: 'React DevTools',
  Content: DevTools,
  actions: [],
};
