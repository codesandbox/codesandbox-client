import React, { FunctionComponent, useEffect } from 'react';
import css from '@styled-system/css';
import { withTheme } from 'styled-components';
import { useActions } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import { Element, ThemeProvider } from '@codesandbox/components';

import { Container } from './elements';
import { Prompt } from './Prompt';

export const CLI: FunctionComponent = withTheme(({ theme }) => {
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
        <Navigation title="CLI Authorization" />
        <Container>
          <Prompt />
        </Container>
      </Element>
    </ThemeProvider>
  );
});
