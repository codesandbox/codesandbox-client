import React, { useEffect, useState, useContext } from 'react';
import { initialize } from 'react-devtools-inline/frontend';
import { dispatch, actions } from 'codesandbox-api';
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
  title: '⚛ Components',
  Content: DevTools,
  actions: [],
};
