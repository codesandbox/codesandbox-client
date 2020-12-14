import React from 'react';
import css from '@styled-system/css';
import { Stack, Text, Button, Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

export const SignInBanner = ({ theme }) => {
  const { actions } = useOvermind();
  const light = theme.type === 'light';

  const Checkmark = ({ children }) => (
    <Text
      block
      marginBottom={1}
      css={css({
        color: light ? 'grays.200' : 'grays.400',
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
    <Element padding={3}>
      <Stack
        gap={2}
        justify="center"
        direction="vertical"
        css={css({
          padding: 4,
          paddingBottom: 2,
          backgroundColor: light ? 'grays.600' : 'white',
          boxShadow: '2',
          borderRadius: 'medium',
        })}
      >
        <Text
          size={22}
          css={css({
            color: light ? 'grays.200' : 'grays.800',
            fontFamily: "'SF Compact Display', 'Inter', sans-serif",
            fontWeight: 900,
          })}
        >
          Sign in to
        </Text>
        <Element
          css={css({
            fontFamily: "'SF Pro Text', 'Inter', sans-serif",
          })}
        >
          <Checkmark>Save your work</Checkmark>
          <Checkmark>Work from any device</Checkmark>
          <Checkmark>Deploy & collaborate</Checkmark>
        </Element>
        <Button onClick={() => actions.signInClicked()} marginTop={2}>
          Sign In
        </Button>
      </Stack>
    </Element>
  );
};
