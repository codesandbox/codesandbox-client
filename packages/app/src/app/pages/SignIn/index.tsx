import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { css } from '@styled-system/css';

import { useAppState, useActions } from 'app/overmind';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Element, Stack, ThemeProvider } from '@codesandbox/components';

import { createWorkspaceUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { SignIn } from './SignIn';

export const SignInPage = () => {
  const state = useAppState();
  const { genericPageMounted } = useActions();
  const redirectAfterSignIn = state.newUserFirstWorkspaceId
    ? createWorkspaceUrl({
        workspaceId: state.newUserFirstWorkspaceId,
      })
    : new URL(location.href).searchParams.get('continue');

  useEffect(() => {
    genericPageMounted();
  }, [genericPageMounted]);

  if (state.hasLogIn) {
    // All post-sigin redirects are handled here
    if (redirectAfterSignIn) {
      // Full redirect if https://
      if (redirectAfterSignIn.startsWith('https')) {
        window.location.replace(redirectAfterSignIn);

        return null;
      }

      return <Redirect to={redirectAfterSignIn} />;
    }

    return <Redirect to={dashboardUrl()} />;
  }

  return (
    <ThemeProvider>
      <Element
        css={css({
          backgroundColor: 'sideBar.background',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
        })}
      >
        <Stack
          css={css({
            width: '100vw',
            height: '100%',
            marginBottom: 100,
            padding: '16px',
          })}
          align="center"
          justify="center"
        >
          <SignIn />
        </Stack>
      </Element>
    </ThemeProvider>
  );
};
