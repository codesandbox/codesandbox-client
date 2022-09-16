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
import { MainTitle, Paragraph } from './components/v2';

import { Wrapper } from './components/Wrapper';
import { Button } from './components/Button';
import { UserNameSelection } from './components/UserNameSelection';
import { DuplicateAccount } from './components/DuplicateAccount';

import '../WaitList/fonts/index.css';

type SignInModalElementProps = {
  redirectTo?: string;
  onSignIn?: () => void;
  v2Style?: boolean;
};

export const SignInModalElement = ({
  redirectTo,
  onSignIn,
  v2Style,
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

  if (v2Style) {
    return (
      <Stack
        padding={8}
        direction="vertical"
        gap={3}
        css={{ textAlign: 'center' }}
      >
        <MainTitle>Welcome to CodeSandbox.</MainTitle>
        <Paragraph>Start building today, easy as never before.</Paragraph>

        <Stack direction="vertical" gap={3} css={{ margin: '20px auto' }}>
          <Button onClick={handleSignIn}>
            <GitHubIcon />
            <Element>Sign in with GitHub</Element>
          </Button>
          <Button css={{ background: 'white' }} onClick={handleGoogleSignIn}>
            <GoogleIcon />
            <Element>Sign in with Google</Element>
          </Button>
          <Button css={{ background: 'white' }} onClick={handleAppleSignIn}>
            <AppleIcon />
            <Element>Sign in with Apple</Element>
          </Button>
        </Stack>
      </Stack>
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
        <CodeSandboxIcon />
        <Text weight="bold" size={23} paddingBottom={1} block>
          Welcome to CodeSandbox.
        </Text>
        <Text variant="muted" size={3} paddingBottom={30} block>
          Get a free account, no credit card required
        </Text>

        <Button loading={loadingAuth.github} onClick={handleSignIn}>
          <GitHubIcon />
          <Element>Sign in with GitHub</Element>
        </Button>
        <Button loading={loadingAuth.google} onClick={handleGoogleSignIn}>
          <GoogleIcon />
          <Element>Sign in with Google</Element>
        </Button>
        <Button loading={loadingAuth.apple} onClick={handleAppleSignIn}>
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
