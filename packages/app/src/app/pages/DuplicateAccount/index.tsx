import React, { FunctionComponent, useEffect, useState } from 'react';
import { Stack, ThemeProvider, Element, Text } from '@codesandbox/components';
import history from 'app/utils/history';
import css from '@styled-system/css';
import {
  github as GitHubIcon,
  GoogleIcon,
} from '@codesandbox/components/lib/components/Icon/icons';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import { Button } from 'app/pages/SignIn/components/Button';

export const DuplicateAccount: FunctionComponent = () => {
  const {
    actions: { signInButtonClicked },
  } = useOvermind();
  const providerToLoginWith = new URLSearchParams(location.search).get(
    'provider'
  );
  const redirectTo = new URLSearchParams(location.search).get('continue');

  useEffect(() => {
    if (window.opener && window.opener !== window) {
      window.opener.postMessage(
        {
          type: 'duplicate',
          data: {
            url: window.location.href,
          },
        },
        protocolAndHost()
      );
    }
  }, []);

  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignIn = async () => {
    setGithubLoading(true);
    await signInButtonClicked({ provider: 'github', useExtraScopes: false });

    if (redirectTo) {
      return history.push(redirectTo.replace(location.origin, ''));
    }
    setGithubLoading(false);

    return null;
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signInButtonClicked({ provider: 'google' });

    if (redirectTo) {
      return history.push(redirectTo.replace(location.origin, ''));
    }
    setGoogleLoading(false);

    return null;
  };

  if (window.opener && window.opener !== window) return null;

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
          direction="vertical"
        >
          <Element
            css={css({
              width: '90%',
              maxWidth: 600,
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
              Existing account found. Please sign in with{' '}
              {providerToLoginWith === 'github' ? 'Github' : 'Google'} instead.
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
              {providerToLoginWith === 'github' ? (
                <Button loading={githubLoading} onClick={handleSignIn}>
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
              {providerToLoginWith === 'google' ? (
                <Button loading={googleLoading} onClick={handleGoogleSignIn}>
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
      </Element>
    </ThemeProvider>
  );
};
