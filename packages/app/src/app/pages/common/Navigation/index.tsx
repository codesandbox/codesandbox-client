import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import {
  Stack,
  ThemeProvider,
  Button,
  Avatar,
  Text,
  Link,
} from '@codesandbox/components';
import { Link as LinkBase } from 'react-router-dom';
import codeSandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import css from '@styled-system/css';

import { UserMenu } from '../UserMenu';
import { Logo } from './Icons';

type Props = {
  title: string;
};
export const Navigation: FunctionComponent<Props> = ({ title }) => {
  const {
    actions: { modalOpened, signInClicked },
    state: { isLoggedIn, isAuthenticating, user },
  } = useOvermind();
  const link = isLoggedIn ? '/dashboard' : '/';

  return (
    <ThemeProvider theme={codeSandboxBlack}>
      <Stack
        as="header"
        justify="space-between"
        align="center"
        paddingX={4}
        css={css({
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
          height: 12,
          color: 'titleBar.activeForeground',
          borderBottom: '1px solid',
          borderColor: 'titleBar.border',
        })}
      >
        <Stack gap={4} align="center">
          <Link to={link} as={LinkBase}>
            <Logo />
          </Link>
          <Text
            size={3}
            css={css({
              fontWeight: 500,
            })}
          >
            CodeSandbox - {title}
          </Text>
        </Stack>
        {!isAuthenticating ? (
          <Stack align="center" gap={6}>
            {!isLoggedIn ? (
              <Button
                css={{ width: 'auto' }}
                variant="link"
                onClick={() => signInClicked()}
              >
                Sign In
              </Button>
            ) : null}
            <Button
              variant="primary"
              css={css({ width: 'auto', paddingX: 3 })}
              onClick={() => modalOpened({ modal: 'newSandbox' })}
            >
              Create Sandbox
            </Button>
            {isLoggedIn ? (
              <UserMenu>
                <Button
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
    </ThemeProvider>
  );
};
