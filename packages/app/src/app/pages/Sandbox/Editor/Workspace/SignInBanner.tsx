import React from 'react';
import css from '@styled-system/css';
import { Stack, Text, Button, Element } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';

export const SignInBanner = ({ theme }) => {
  const { signInClicked } = useActions();
  const dark = theme.type !== 'light';

  const Checkmark = ({ children }) => (
    <Text
      block
      marginBottom={1}
      css={css({
        color: 'grays.200',
        lineHeight: '150%',
        span: {
          color: 'blues.500',
          paddingRight: 1,
        },
      })}
    >
      <span>✓</span>
      {children}
    </Text>
  );

  return (
    <Element
      css={css({
        fontFamily: 'Inter, Roboto, sans-serif',
        borderTop: '1px solid',
        borderColor: 'sideBar.border',
        filter: dark ? 'drop-shadow(0px -16px 8px rgba(0,0,0,.32))' : null,
        zIndex: 999,
      })}
    >
      <Stack
        gap={2}
        justify="center"
        direction="vertical"
        css={css({
          padding: 4,
          backgroundColor: 'grays.800',
        })}
      >
        <Text
          size={22}
          paddingBottom={2}
          css={css({
            color: 'grays.200',
            fontWeight: 900,
          })}
        >
          Sign in to
        </Text>
        <Element>
          <Checkmark>Save your work</Checkmark>
          <Checkmark>Work from any device</Checkmark>
          <Checkmark>Deploy & collaborate</Checkmark>
        </Element>
        <Button
          variant="secondary"
          onClick={() => {
            track('Sidebar Sign In Ad Clicked');
            signInClicked();
          }}
          marginTop={2}
        >
          Sign In
        </Button>
      </Stack>
    </Element>
  );
};
