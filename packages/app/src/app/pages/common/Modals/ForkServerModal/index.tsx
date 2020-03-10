import getTemplateDefinition from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, useEffect } from 'react';

import { Element, Button, Text, Stack } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';

export const ForkServerModal: FunctionComponent = () => {
  const {
    actions: {
      editor: { forkSandboxClicked },
      modalClosed,
      signInClicked,
    },
    state: {
      editor: { currentSandbox },
      isLoggedIn,
    },
  } = useOvermind();

  const { template } = currentSandbox;

  useEffect(() => {
    // Which means that the user signed in in the meantime with the intention to fork
    if (isLoggedIn) {
      forkSandboxClicked();

      modalClosed();
    }
  }, [forkSandboxClicked, isLoggedIn, modalClosed]);

  const { niceName } = getTemplateDefinition(template);

  return (
    <Element padding={4} paddingTop={6}>
      <Text weight="bold" block size={4} paddingBottom={2}>
        Fork {niceName} Sandbox
      </Text>
      <Text marginBottom={6} size={3} block>
        We execute {niceName} sandboxes in a server container. This is still in
        beta, so we require you to sign in before you can fork a {niceName}{' '}
        sandbox.
      </Text>
      <Stack gap={2} align="center" justify="flex-end">
        <Button
          title="Sign in with GitHub"
          css={css({
            width: 'auto',
          })}
          onClick={() => signInClicked({ useExtraScopes: false })}
        >
          <Text>Sign in with GitHub</Text>
        </Button>
      </Stack>
    </Element>
  );
};
