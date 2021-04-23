import { useAppState, useActions } from 'app/overmind';
import React from 'react';
import {
  Stack,
  ThemeProvider,
  Button,
  Avatar,
  Text,
  Link,
} from '@codesandbox/components';
import {
  Link as LinkBase,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import css from '@styled-system/css';

import { UserMenu } from '../UserMenu';
import { Logo } from './Icons';

type Props = {
  title?: string;
} & RouteComponentProps;

export const NavigationComponent = ({ title, match }: Props) => {
  const { signInClicked, openCreateSandboxModal } = useActions();
  const { isLoggedIn, isAuthenticating, user } = useAppState();
  const link = isLoggedIn ? '/dashboard' : '/';

  return (
    <ThemeProvider>
      <Stack
        as="header"
        paddingX={4}
        paddingY={0}
        css={css({
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
          height: 48,
          color: 'titleBar.activeForeground',
          borderBottom: '1px solid',
          borderColor: 'titleBar.border',
        })}
      >
        <Stack
          css={css({ maxWidth: '80%', width: 1080, marginX: 'auto' })}
          justify="space-between"
          align="center"
        >
          <Stack gap={4} align="center">
            <Link css={css({ display: 'flex' })} to={link} as={LinkBase}>
              <Logo />
            </Link>
            <Text
              size={3}
              css={css({
                fontWeight: 500,
                '@media screen and (max-width: 768px)': {
                  display: 'none',
                },
              })}
            >
              CodeSandbox - {title}
            </Text>
          </Stack>
          {!isAuthenticating ? (
            <Stack align="center" gap={6}>
              {!isLoggedIn && match.path !== '/signin' ? (
                <Button
                  autoWidth
                  variant="link"
                  onClick={() => signInClicked()}
                >
                  Sign In
                </Button>
              ) : null}
              <Button
                variant="primary"
                css={css({ width: 'auto', paddingX: 3 })}
                onClick={() => {
                  openCreateSandboxModal({});
                }}
              >
                Create Sandbox
              </Button>
              {isLoggedIn ? (
                <UserMenu>
                  <Button
                    as={UserMenu.Button}
                    variant="secondary"
                    css={css({
                      padding: 0,
                      height: 'auto',
                      border: 'none',
                    })}
                  >
                    <Avatar
                      css={css({
                        width: 26,
                        height: 26,
                      })}
                      user={user}
                    />
                  </Button>
                </UserMenu>
              ) : null}
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export const Navigation = withRouter(NavigationComponent);
