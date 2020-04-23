import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import { ThemeProvider, Stack } from '@codesandbox/components';
import css from '@styled-system/css';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Content } from './Content';

export const Dashboard: FunctionComponent = () => {
  const {
    state: { hasLogIn },
  } = useOvermind();

  if (!hasLogIn) {
    return <Redirect to={signInPageUrl()} />;
  }

  return (
    <ThemeProvider theme={codesandboxBlack}>
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
          <Content />
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
