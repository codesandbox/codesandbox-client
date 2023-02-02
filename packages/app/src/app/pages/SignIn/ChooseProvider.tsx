import React from 'react';
import { Button as MainButton, Stack, Text } from '@codesandbox/components';
import {
  AppleIcon,
  github as GitHubIcon,
  CodeSandboxIcon,
  GoogleIcon,
} from '@codesandbox/components/lib/components/Icon/icons';
import { useActions, useAppState } from 'app/overmind';
import history from 'app/utils/history';

import { Button } from './components/Button';

type ChooseProviderProps = {
  redirectTo?: string;
  onSignIn?: () => void;
};
export const ChooseProvider: React.FC<ChooseProviderProps> = ({
  redirectTo,
  onSignIn,
}) => {
  const { loadingAuth, cancelOnLogin } = useAppState();
  const {
    signInButtonClicked,
    setLoadingAuth,
    toggleSignInModal,
  } = useActions();

  const handleSignIn = async (provider: 'github' | 'google' | 'apple') => {
    setLoadingAuth(provider);

    await signInButtonClicked({ provider });

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

    setLoadingAuth(provider);
  };
  return (
    <Stack
      align="center"
      css={{
        width: '100%',
        height: '100%',
        padding: '48px 0',
        color: '#fff',
      }}
      direction="vertical"
      justify="space-between"
    >
      <CodeSandboxIcon width={48} height={48} />
      <Stack direction="vertical" gap={8}>
        <Stack direction="vertical" gap={3}>
          <Text
            as="h1"
            css={{
              maxWidth: '396px',
              margin: 0,
              textAlign: 'center',
              fontFamily: 'Everett, sans-serif',
              lineHeight: 1.17,
              letterSpacing: '-0.018em',
            }}
            size={48}
            weight="medium"
          >
            Sign in to CodeSandbox
          </Text>
          <Text
            css={{
              textAlign: 'center',
              lineHeight: 1.5,
              opacity: 0.6,
            }}
            size={4}
          >
            Login or register to start building your projects today.
          </Text>
        </Stack>
        <Stack direction="vertical" gap={3}>
          <Button
            css={{
              width: '100%',
              height: '48px',
            }}
            loading={loadingAuth.github}
            onClick={() => handleSignIn('github')}
          >
            <GitHubIcon />
            <Text
              as="span"
              css={{
                lineHeight: 1,
              }}
              size={4}
              weight="medium"
            >
              Sign in with GitHub
            </Text>
          </Button>
          <Stack
            css={{
              '@media screen and (max-width: 440px)': {
                flexDirection: 'column',
              },
            }}
            gap={3}
          >
            <Button
              css={{
                width: '100%',
                height: '40px',
                flex: 1,
              }}
              loading={loadingAuth.google}
              onClick={() => handleSignIn('google')}
              secondary
            >
              <GoogleIcon />
              <Text as="span" css={{ lineHeight: 1 }} size={3} weight="medium">
                Sign in with Google
              </Text>
            </Button>
            <Button
              css={{
                width: '100%',
                height: '40px',
                flex: 1,
              }}
              loading={loadingAuth.apple}
              onClick={() => handleSignIn('apple')}
              secondary
            >
              <AppleIcon />
              <Text as="span" css={{ lineHeight: 1 }} size={3} weight="medium">
                Sign in with Apple
              </Text>
            </Button>
          </Stack>
        </Stack>
        {cancelOnLogin && (
          <MainButton
            variant="link"
            type="button"
            onClick={() => {
              cancelOnLogin();
              toggleSignInModal();
            }}
          >
            <Text>Continue without an account</Text>
          </MainButton>
        )}
      </Stack>

      <Text
        variant="muted"
        align="center"
        size={10}
        block
        css={{
          lineHeight: '13px',
          maxWidth: '200px',
          margin: '24px 0 0 0',

          a: {
            color: 'inherit',
          },
        }}
      >
        By continuing, you agree to CodeSandbox{' '}
        <a
          href="https://codesandbox.io/legal/terms"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>
        ,{' '}
        <a
          href="https://codesandbox.io/legal/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
      </Text>
    </Stack>
  );
};
