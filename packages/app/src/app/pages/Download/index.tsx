import React, { FunctionComponent, useEffect } from 'react';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import { Text, Stack, ThemeProvider } from '@codesandbox/components';
import { useParams } from 'react-router-dom';

export const Download: FunctionComponent = () => {
  const { actions, state } = useOvermind();
  const { id } = useParams();

  useEffect(() => {
    if (!state.editor.currentSandbox) {
      actions.editor.sandboxChanged({ id });
    }
    actions.editor.createZipClicked();
  }, [state.editor.currentSandbox]);

  return (
    <ThemeProvider>
      <Stack
        direction="vertical"
        css={css({ width: '100vw', height: '100vh' })}
      >
        <Navigation title="Sandbox Download" />
        <Stack
          align="center"
          justify="center"
          css={css({
            flexGrow: 1,
            color: 'sideBar.foreground'
          })}
        >
          <Text align="center" size={9}>
            Downloading...
          </Text>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
