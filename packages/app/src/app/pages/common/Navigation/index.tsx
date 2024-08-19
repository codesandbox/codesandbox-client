import { useAppState, useActions } from 'app/overmind';
import React from 'react';
import {
  Stack,
  ThemeProvider,
  Button,
  Avatar,
  Text,
  Link,
  Icon,
} from '@codesandbox/components';
import { LogoFull } from '@codesandbox/common/lib/components/Logo';
import {
  Link as LinkBase,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import css from '@styled-system/css';

import { UserMenu } from '../UserMenu';

type Props = {
  title?: string;
  showActions?: boolean;
} & RouteComponentProps;

const NavigationComponent = ({ title, match, showActions = true }: Props) => {
  const { signInClicked, modalOpened } = useActions();
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
          css={css({
            '@media screen and (min-width: 768px)': {
              maxWidth: '80%',
            },
            width: 1080,
            marginX: 'auto',
          })}
          justify="space-between"
          align="center"
        >
          <Stack gap={4} align="center">
            <Link css={css({ display: 'flex' })} to={link} as={LinkBase}>
              <LogoFull />
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
              {title}
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
              {showActions && (
                <Button
                  variant="ghost"
                  css={{ width: 'auto' }}
                  onClick={() => {
                    modalOpened({ modal: 'create' });
                  }}
                >
                  <Icon
                    name="plus"
                    size={16}
                    title="Create new"
                    css={{ marginRight: '8px' }}
                  />
                  Create
                </Button>
              )}
              {isLoggedIn ? (
                <UserMenu>
                  <Button
                    as={UserMenu.Button}
                    variant="secondary"
                    css={css({
                      padding: 0,
                      height: 'auto',
                      border: 'none',
                      borderRadius: '100%',
                      marginTop: 1,
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
