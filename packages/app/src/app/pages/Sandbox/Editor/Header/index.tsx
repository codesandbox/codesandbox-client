import { Link as RouterLink } from 'react-router-dom';
import { Link, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState } from 'app/overmind';
import React from 'react';

import { Actions } from './Actions';
import { AppMenu } from './AppMenu';
import { SandboxName } from './SandboxName';
import { WorkspaceName } from './WorkspaceName';
import { SignInBanner } from './SignInAd';

export const Header = () => {
  const { editor, isAuthenticating, user } = useAppState();

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
          <AppMenu />
          {user ? <WorkspaceName /> : <Link as={RouterLink}>TODO</Link>}
        </Stack>

        {editor.currentSandbox && !isAuthenticating ? <SandboxName /> : null}
        {editor.currentSandbox && !isAuthenticating ? <Actions /> : null}
      </Stack>
    </>
  );
};
