import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Element, Button, Text, Stack, Icon } from '@codesandbox/components';
import css from '@styled-system/css';

export const SignInForTemplates: FunctionComponent = () => {
  const {
    actions: { modalClosed, signInClicked },
  } = useOvermind();

  const handleSignIn = async () => {
    await signInClicked({ useExtraScopes: false });
  };

  return (
    <Element padding={4} paddingTop={6}>
      <Text weight="bold" block size={4} paddingBottom={2}>
        Sign in to create templates
      </Text>
      <Text marginBottom={6} size={3} block>
        You can only create templates as a logged in user.
      </Text>
      <Stack gap={2} align="center" justify="flex-end">
        <Button
          css={css({
            width: 'auto',
          })}
          variant="link"
          onClick={modalClosed}
        >
          Cancel
        </Button>
        <Button
          title="Sign in with GitHub"
          css={css({
            width: 'auto',
          })}
          onClick={handleSignIn}
        >
          <Stack align="center" gap={1}>
            <Icon name="github" />
            <Text>Sign in with GitHub</Text>
          </Stack>
        </Button>
      </Stack>
    </Element>
  );
};
