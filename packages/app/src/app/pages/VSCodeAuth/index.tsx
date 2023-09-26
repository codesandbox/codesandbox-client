import React, { FunctionComponent, useEffect } from 'react';
import css from '@styled-system/css';
import { withTheme } from 'styled-components';
import { Element, ThemeProvider } from '@codesandbox/components';

import { useActions } from 'app/overmind';
import { Container } from './elements';
import { Prompt } from './Prompt';

export const VSCodeAuth: FunctionComponent = withTheme(({ theme }) => {
  const { cliMounted } = useActions();

  useEffect(() => {
    cliMounted();
  }, [cliMounted]);

  return (
    <ThemeProvider theme={theme.vsCode}>
      <Element
        css={css({
          width: '100vw',
          overflow: 'hidden',
          backgroundColor: 'sideBar.background',
        })}
      >
        <Container>
          <Prompt />
        </Container>
      </Element>
    </ThemeProvider>
  );
});
