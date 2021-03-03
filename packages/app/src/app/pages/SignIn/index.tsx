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

  if (state.hasLogIn && !redirectTo) {
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
          })}
          align="center"
          justify="center"
        >
          <SignInModalElement redirectTo={redirectTo} />
        </Stack>
      </Element>
    </ThemeProvider>
  );
};
