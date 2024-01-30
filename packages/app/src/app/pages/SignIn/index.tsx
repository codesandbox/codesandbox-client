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
  const redirectTo = new URL(location.href).searchParams.get('continue');

  useEffect(() => {
    genericPageMounted();
  }, [genericPageMounted]);

  /**
   * 🚧 Utility to debug Trial Onboarding Questions
   */
  const TOQ_DEBUG = window.localStorage.getItem('TOQ_DEBUG') === 'ENABLED';

  if (state.hasLogIn && state.newUserFirstWorkspaceId) {
    console.log(
      'top level redirect to create workspace',
      state.newUserFirstWorkspaceId
    );
    return (
      <Redirect
        to={createWorkspaceUrl({ workspaceId: state.newUserFirstWorkspaceId })}
      />
    );
  }

  // 🚧 Remove && !TOQ_DEBUG
  if (state.hasLogIn && !redirectTo && !TOQ_DEBUG) {
    console.log('top level redirect to dashboard');
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
          <SignIn redirectTo={redirectTo} />
        </Stack>
      </Element>
    </ThemeProvider>
  );
};
