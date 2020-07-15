import React, { useState, useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { github as GitHubIcon } from '@codesandbox/components/lib/components/Icon/icons';
import {
  Element,
  Text,
  Stack,
  Input,
  Button as SignUpButton,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import history from 'app/utils/history';
import { LeftSide } from './components/LeftSide';
import { Wrapper } from './components/Wrapper';
import { Button } from './components/Button';

type SignInModalElementProps = {
  redirectTo?: string;
  onSignIn?: () => void;
};

export const SignInModalElement = ({
  redirectTo,
  onSignIn,
}: SignInModalElementProps) => {
  const {
    state: { pendingUser, pendingUserId },
    actions: {
      signInButtonClicked,
      getPendingUser,
      validateUsername,
      finalizeSignUp,
    },
  } = useOvermind();
  const [newUsername, setNewUsername] = useState('');
  const [loadingUsername, setLoadingUserName] = useState(false);

  useEffect(() => {
    if (pendingUserId) {
      getPendingUser();
    }
  }, [getPendingUser, pendingUserId]);

  useEffect(() => {
    setNewUsername(pendingUser?.username);
  }, [pendingUser]);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signInButtonClicked({ useExtraScopes: false });

    if (onSignIn) {
      return onSignIn();
    }

    if (redirectTo) {
      return history.push(redirectTo.replace(location.origin, ''));
    }
    setLoading(false);

    return null;
  };

  return (
    <Wrapper usernameSelection={pendingUser}>
      {pendingUser ? (
        <Stack
          justify="center"
          align="center"
          marginTop={6}
          style={{ height: 'calc(100vh - 72px)' }}
        >
          <Element style={{ maxWidth: 1024 }}>
            <Element style={{ maxWidth: 400 }}>
              <Stack direction="vertical" align="center" gap={4}>
                <Element>
                  <img
                    alt={pendingUser.username}
                    css={css({
                      width: 100,
                      height: 100,
                      border: '1px solid',
                      borderColor: 'grays.500',
                      borderRadius: 'medium',
                    })}
                    src={pendingUser.avatarUrl}
                  />
                </Element>
                <Text weight="bold" size={6}>
                  Please select your username
                </Text>

                <Input
                  onBlur={async e => {
                    setLoadingUserName(true);
                    await validateUsername(e.target.value);
                    setLoadingUserName(false);
                  }}
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                />
                {!pendingUser.valid ? (
                  <Text size={3} variant="danger">
                    Sorry, that username is already taken.
                  </Text>
                ) : null}
                <SignUpButton
                  onClick={finalizeSignUp}
                  disabled={loadingUsername || !pendingUser.valid}
                >
                  {loadingUsername ? 'Checking username...' : 'Finish Sign Up'}
                </SignUpButton>
              </Stack>
            </Element>
          </Element>
        </Stack>
      ) : (
        <>
          <LeftSide />
          <Element padding={8}>
            <Text weight="bold" size={23} paddingBottom={3} block>
              Sign in to CodeSandbox
            </Text>
            <Text variant="muted" size={3} paddingBottom={60} block>
              Get a free account, no credit card required
            </Text>

            <Button loading={loading} onClick={handleSignIn}>
              <GitHubIcon width="20" height="20" />
              <Element css={css({ width: '100%' })}>
                Sign in with GitHub
              </Element>
            </Button>
            <Text
              variant="muted"
              align="center"
              size={10}
              block
              css={css({
                lineHeight: '13px',
                maxWidth: '200px',
                margin: 'auto',

                a: {
                  color: 'inherit',
                },
              })}
            >
              By continuing, you agree to CodeSandbox{' '}
              <a href="https://codesandbox.io/legal/terms">Terms of Service</a>,{' '}
              <a href="https://codesandbox.io/legal/privacy">Privacy Policy</a>
            </Text>
          </Element>
        </>
      )}
    </Wrapper>
  );
};
