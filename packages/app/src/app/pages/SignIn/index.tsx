import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { useAppState, useActions } from 'app/overmind';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Element, Stack, ThemeProvider } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { Navigation } from '../common/Navigation';
import { SignInModalElement } from './Modal';
import { TermsAndUsage } from './components/v2';

export const SignIn = () => {
  const state = useAppState();
  const { genericPageMounted } = useActions();
  const redirectTo = new URL(location.href).searchParams.get('continue');
  const v2Style = new URL(location.href).searchParams.get('v2');

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
          backgroundColor: v2Style ? '#0f0e0e' : 'sideBar.background',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
        })}
      >
        {!v2Style && <Navigation title="Sign In" />}
        <Stack
          css={css({
            width: '100vw',
            height: '100%',
            marginBottom: 100,
          })}
          align="center"
          justify="center"
        >
          <SignInModalElement v2Style={!!v2Style} redirectTo={redirectTo} />
        </Stack>

        <Element css={{ marginTop: -156 }}>
          <TermsAndUsage />
        </Element>
      </Element>
    </ThemeProvider>
  );
};
