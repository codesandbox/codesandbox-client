import React from 'react';
import { Stack, Element, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import {
  github as GitHubIcon,
  GoogleIcon,
} from '@codesandbox/components/lib/components/Icon/icons';
import { useAppState, useActions } from 'app/overmind';
import { Button } from 'app/pages/SignIn/components/Button';

export const DuplicateAccount = ({
  provider,
}: {
  provider: 'google' | 'github';
}) => {
  const { loadingAuth } = useAppState();
  const { signInButtonClicked, setLoadingAuth } = useActions();

  const handleSignIn = async () => {
    setLoadingAuth('github');
    await signInButtonClicked({ provider: 'github', useExtraScopes: false });
    setLoadingAuth('github');

    return null;
  };

  const handleGoogleSignIn = async () => {
    setLoadingAuth('google');
    await signInButtonClicked({ provider: 'google' });
    setLoadingAuth('google');

    return null;
  };

  if (!provider) return null;

  return (
    <Stack align="center" justify="center" direction="vertical">
      <Element
        css={css({
          margin: 'auto',
        })}
      >
        <Text
          size={4}
          css={css({ color: 'white' })}
          block
          align="center"
          marginBottom={8}
        >
          We found an existing account, please sign in with{' '}
          {provider === 'github' ? 'GitHub' : 'Google'} instead.
        </Text>
        <Stack
          justify="center"
          css={css({
            button: {
              width: 'auto',
              ':hover, :focus': {
                background: 'white !important',
              },
            },
          })}
        >
          {provider === 'github' ? (
            <Button loading={loadingAuth.github} onClick={handleSignIn}>
              <GitHubIcon
                width="16"
                height="16"
                css={css({ marginRight: 2 })}
              />
              <Element css={css({ width: '100%' })}>
                Sign in with GitHub
              </Element>
            </Button>
          ) : null}
          {provider === 'google' ? (
            <Button loading={loadingAuth.google} onClick={handleGoogleSignIn}>
              <GoogleIcon
                width="16"
                height="16"
                css={css({ marginRight: 2 })}
              />
              <Element css={css({ width: '100%' })}>
                Sign in with Google
              </Element>
            </Button>
          ) : null}
        </Stack>
      </Element>
    </Stack>
  );
};
