import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState } from 'app/overmind';
import React from 'react';

import { Actions } from './Actions';
import { DashboardIcon } from './icons';
import { MenuBar } from './MenuBar';
import { SandboxName } from './SandboxName';
import { WorkspaceName } from './WorkspaceName';
import { SignInBanner } from './SignInAd';

export const Header = () => {
  const { hasLogIn, editor, isAuthenticating, user } = useAppState();

  const LoggedIn = () =>
    user ? (
      <WorkspaceName />
    ) : (
      <Link
        as={RouterLink}
        variant="muted"
        to={dashboardUrl()}
        style={{ color: 'inherit' }}
        css={{
          transition: '0.3s ease opacity',
          opacity: 0.6,
          lineHeight: 0 /* micro adjustment */,
          ':hover': {
            opacity: 1,
          },
        }}
      >
        <DashboardIcon />
      </Link>
    );

  const LoginLink = () => (
    <Link
      as="a"
      target="_blank"
      rel="noreferrer noopener"
      href="/"
      css={{ padding: '2px' /* micro adjustment */ }}
    >
      <LogoIcon height={24} />
    </Link>
  );

  return (
    <>
      {!user && <SignInBanner />}
      <Stack
        as="header"
        justify="space-between"
        align="center"
        paddingX={2}
        css={css({
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
          height: 12,
          backgroundColor: 'titleBar.activeBackground',
          color: 'titleBar.activeForeground',
          borderBottom: '1px solid',
          borderColor: 'titleBar.border',
        })}
      >
        <Stack align="center">
          {hasLogIn ? <LoggedIn /> : <LoginLink />}
          {/* <MenuBar /> */}
        </Stack>

        {editor.currentSandbox && !isAuthenticating ? <SandboxName /> : null}
        {editor.currentSandbox && !isAuthenticating ? <Actions /> : null}
      </Stack>
    </>
  );
};
