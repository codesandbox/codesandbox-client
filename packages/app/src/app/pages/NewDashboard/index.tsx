import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import { ThemeProvider, Stack, Element } from '@codesandbox/components';
import { createGlobalStyle } from 'styled-components';
import css from '@styled-system/css';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Content } from './Content';

const GlobalStyles = createGlobalStyle({
  body: { overflow: 'hidden' },
});

export const Dashboard: FunctionComponent = () => {
  const {
    state: { hasLogIn },
  } = useOvermind();

  if (!hasLogIn) {
    return <Redirect to={signInPageUrl()} />;
  }

  return (
    <ThemeProvider theme={codesandboxBlack}>
      <GlobalStyles />
      <Stack
        direction="vertical"
        css={css({
          fontFamily: "'Inter', sans-serif",
          backgroundColor: 'sideBar.background',
          color: 'sideBar.foreground',
          width: '100vw',
          minHeight: '100vh',
        })}
      >
        <Header />
        <Stack css={{ flexGrow: 1 }}>
          <Sidebar />

          <Element
            as="main"
            css={{
              width: '100%',
              height: 'calc(100vh - 48px)',
              overflowY: 'scroll',
            }}
          >
            <Content />
          </Element>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
