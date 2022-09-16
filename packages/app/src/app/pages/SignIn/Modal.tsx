import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import {
  AppleIcon,
  github as GitHubIcon,
  CodeSandboxIcon,
  GoogleIcon,
} from '@codesandbox/components/lib/components/Icon/icons';
import {
  Element,
  Stack,
  Text,
  Button as MainButton,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import history from 'app/utils/history';

import { Wrapper } from './components/Wrapper';
import { Button } from './components/Button';
import { UserNameSelection } from './components/UserNameSelection';
import { DuplicateAccount } from './components/DuplicateAccount';

import '../WaitList/fonts/index.css';

type SignInModalElementProps = {
  redirectTo?: string;
  onSignIn?: () => void;
};

export const SignInModalElement = ({
  redirectTo,
  onSignIn,
}: SignInModalElementProps) => {
  const {
    duplicateAccountStatus,
    pendingUser,
    pendingUserId,
    loadingAuth,
    cancelOnLogin,
  } = useAppState();
  const {
    signInButtonClicked,
    getPendingUser,
    setLoadingAuth,
    toggleSignInModal,
  } = useActions();

  useEffect(() => {
    if (pendingUserId) {
      getPendingUser();
    }
  }, [getPendingUser, pendingUserId]);

  const handleSignIn = async () => {
    setLoadingAuth('github');
    await signInButtonClicked({ provider: 'github', useExtraScopes: false });

    if (onSignIn) {
      return onSignIn();
    }

    if (redirectTo) {
      if (redirectTo.startsWith('https')) {
        window.location.replace(redirectTo);

        return null;
      }

      return history.push(redirectTo.replace(location.origin, ''));
    }
    setLoadingAuth('github');

    return null;
  };

  const handleGoogleSignIn = async () => {
    setLoadingAuth('google');
    await signInButtonClicked({ provider: 'google' });

    if (onSignIn) {
      return onSignIn();
    }

    if (redirectTo) {
      if (redirectTo.startsWith('https')) {
        window.location.replace(redirectTo);

        return null;
      }

      return history.push(redirectTo.replace(location.origin, ''));
    }

    setLoadingAuth('google');

    return null;
  };

  const handleAppleSignIn = async () => {
    setLoadingAuth('apple');
    await signInButtonClicked({ provider: 'apple' });

    if (onSignIn) {
      return onSignIn();
    }

    if (redirectTo) {
      if (redirectTo.startsWith('https')) {
        window.location.replace(redirectTo);

        return null;
      }

      return history.push(redirectTo.replace(location.origin, ''));
    }

    setLoadingAuth('apple');

    return null;
  };

  if (duplicateAccountStatus) {
    return (
      <Wrapper oneCol>
        <DuplicateAccount provider={duplicateAccountStatus.provider} />
      </Wrapper>
    );
  }

  if (pendingUser) {
    return (
      <Wrapper oneCol>
        <UserNameSelection />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Stack
        padding={8}
        direction="vertical"
        justify="center"
        align="center"
        gap={3}
        css={{ textAlign: 'center' }}
      >
        <CodeSandboxIcon width={56} height={56} />
        <Text
          as="h2"
          weight="medium"
          align="center"
          css={{
            fontSize: 32,
            fontFamily: 'Inter, sans-serif',
            margin: 0,
            letterSpacing: '-.025em',
          }}
          block
        >
          Sign in to CodeSandbox
        </Text>
        <Text
          as="p"
          variant="muted"
          size={3}
          css={{
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            marginBottom: '40px!important',
            margin: 0,
          }}
          block
        >
          Create, share, and get feedback with collaborative code.
        </Text>
        <Button loading={loadingAuth.github} onClick={handleSignIn}>
          <GitHubIcon />
          <Element>Sign in with GitHub</Element>
        </Button>
        <Text
          variant="muted"
          size={3}
          css={{
            fontSize: 13,

            margin: 0,
          }}
          block
        >
          -
        </Text>
        <Button
          loading={loadingAuth.google}
          onClick={handleGoogleSignIn}
          secondary
        >
          <GoogleIcon />
          <Element>Sign in with Google</Element>
        </Button>
        <Button
          loading={loadingAuth.apple}
          onClick={handleAppleSignIn}
          secondary
        >
          <AppleIcon />
          <Element>Sign in with Apple</Element>
        </Button>
        {cancelOnLogin && (
          <MainButton
            variant="link"
            type="button"
            css={{
              marginBottom: 53,
              color: '#000',
              '&:hover:not(:disabled)': {
                color: '#000',
                opacity: 0.7,
              },
            }}
            onClick={() => {
              cancelOnLogin();
              toggleSignInModal();
            }}
          >
            <Text>Continue without an account</Text>
          </MainButton>
        )}
        <Text
          variant="muted"
          align="center"
          size={10}
          block
          css={css({
            lineHeight: '13px',
            maxWidth: '200px',
            margin: '24px 0 0 0',

            a: {
              color: 'inherit',
            },
          })}
        >
          By continuing, you agree to CodeSandbox{' '}
          <a href="https://codesandbox.io/legal/terms">Terms of Service</a>,{' '}
          <a href="https://codesandbox.io/legal/privacy">Privacy Policy</a>
        </Text>
      </Stack>
    </Wrapper>
  );
};
