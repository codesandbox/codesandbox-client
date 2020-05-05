import React from 'react';
import { useOvermind } from 'app/overmind';
import { github as GitHubIcon } from '@codesandbox/components/lib/components/Icon/icons';
import { Element, Text, Button } from '@codesandbox/components';
import { css } from '@styled-system/css';
import history from 'app/utils/history';

export const SignInModalElement = ({ redirectTo }) => {
  const {
    actions: { signInClicked },
  } = useOvermind();

  const handleSignIn = async () => {
    await signInClicked({ useExtraScopes: false });
    history.push(redirectTo.replace(location.origin, ''));
  };
  return (
    <Element
      css={css({
        width: 670,
        height: 400,
        backgroundColor: 'white',
        border: 1,
        borderStyle: 'solid',
        borderColor: 'grays.500',
        boxSizing: 'border-box',
        boxShadow: '2',
        borderRadius: 8,
        boxSixing: 'border-box',
        color: 'grays.800',
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        overflow: 'hidden',
      })}
    >
      <Element
        padding={8}
        css={css({
          color: 'white',
          backgroundColor: 'grays.800',
        })}
      >
        <Text weight="bold" size={5} paddingBottom={4} block>
          CodeSandbox
        </Text>
        <Text block marginBottom={2} variant="muted">
          <Text variant="active" paddingRight={1}>
            ✓
          </Text>
          Development & Prototyping
        </Text>
        <Text block marginBottom={2} variant="muted">
          <Text variant="active" paddingRight={1}>
            ✓
          </Text>
          Online IDE
        </Text>
        <Text block marginBottom={2} variant="muted">
          <Text variant="active" paddingRight={1}>
            ✓
          </Text>
          Embeds
        </Text>
        <Text block marginBottom={2} variant="muted">
          <Text variant="active" paddingRight={1}>
            ✓
          </Text>
          CodeSandbox CI
        </Text>
        <Text block marginBottom={2} variant="muted">
          <Text variant="active" paddingRight={1}>
            ✓
          </Text>
          Teams
        </Text>
      </Element>
      <Element padding={8}>
        <Text weight="bold" size={23} paddingBottom={3} block>
          Sign in to CodeSandbox
        </Text>
        <Text variant="muted" size={3} paddingBottom={60} block>
          Test your ideas early and often.
        </Text>

        <Button
          onClick={handleSignIn}
          css={css({
            fontSize: '1em',
            backgroundColor: 'white',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            color: 'grays.900',
            height: 'auto',
            padding: '12px 24px',
            justifyContent: 'flex-start',
            marginBottom: 8,
            borderRadius: 'medium',

            ':hover, :focus': {
              background: 'transparent !important',
              backgroundColor: 'white',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              color: 'grays.900',
            },
          })}
        >
          <GitHubIcon width="20" height="20" />
          <Element css={css({ width: '100%' })}>Sign in with GitHub</Element>
        </Button>
        <Text
          variant="muted"
          align="center"
          size={10}
          block
          css={css({
            lineHeight: '13px',

            a: {
              color: 'inherit',
            },
          })}
        >
          By continuing, you agree to CodeSandbox{' '}
          <a href="https://codesandbox.io/legal/terms">Terms of Service</a>,
          <a href="https://codesandbox.io/legal/privacy">Privacy Policy</a>
        </Text>
      </Element>
    </Element>
  );
};
