import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { useAppState, useActions } from 'app/overmind';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Element, Stack, ThemeProvider } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { Navigation } from '../common/Navigation';
import { SignInModalElement } from './Modal';

export const SignIn = () => {
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

  // 🚧 Remove && !TOQ_DEBUG
  if (state.hasLogIn && !redirectTo && !TOQ_DEBUG) {
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
        <Navigation title="Sign In" />
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
          {/* TODO: Maybe we should work with routes and redirects here instead of a modal  */}
          {/* https://v5.reactrouter.com/web/guides/philosophy/nested-routes */}
          <SignInModalElement redirectTo={redirectTo} />
        </Stack>
      </Element>
    </ThemeProvider>
  );
};
