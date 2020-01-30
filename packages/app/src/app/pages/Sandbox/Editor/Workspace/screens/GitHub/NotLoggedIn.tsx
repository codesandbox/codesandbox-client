import React from 'react';
import css from '@styled-system/css';

import {
  Element,
  Collapsible,
  Stack,
  Text,
  Button,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

export const NotLoggedIn = () => {
  const {
    actions: { signInClicked },
  } = useOvermind();

  return (
    <Collapsible title="GitHub" defaultOpen>
      <Element css={css({ paddingX: 2 })}>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text size={2} variant="muted" block>
            You need to be signed in to export this sandbox to GitHub and make
            commits and pull requests to it.
          </Text>
        </Stack>
        <Button
          variant="primary"
          onClick={() => signInClicked({ useExtraScopes: false })}
        >
          Sign in with GitHub
        </Button>
      </Element>
    </Collapsible>
  );
};
