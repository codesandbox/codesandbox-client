import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { useEffect, FunctionComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { client } from 'app/graphql/client';
import { useOvermind } from 'app/overmind';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import { Element, ThemeProvider, Stack } from '@codesandbox/components';
import { Sidebar } from './Sidebar';

type Theme = {
  colors: any;
  name: string;
};

const GlobalStyle = createGlobalStyle`
  html body {
    font-family: 'Inter', sans-serif;
    background: ${({ theme }: { theme: Theme }) =>
      theme.colors.sideBar.background} !important;
    color: ${({ theme }: { theme: Theme }) => theme.colors.sideBar.foreground};

    * {
      box-sizing: border-box;
    }
  }
`;

export const Dashboard: FunctionComponent = () => {
  const {
    actions: {
      dashboard: { dashboardMounted },
    },
    state: { hasLogIn },
  } = useOvermind();

  useEffect(() => {
    dashboardMounted();

    // Reset store so new visits get fresh data
    return () => client.resetStore();
  }, [dashboardMounted]);

  if (!hasLogIn) {
    return <Redirect to={signInPageUrl()} />;
  }

  return (
    <ThemeProvider theme={codesandboxBlack}>
      <GlobalStyle />
      <Stack gap={6} style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Element>I AM THE CONTENT</Element>
      </Stack>
    </ThemeProvider>
  );
};
