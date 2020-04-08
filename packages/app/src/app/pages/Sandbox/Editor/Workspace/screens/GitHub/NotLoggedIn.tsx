import {
  Button,
  Collapsible,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

export const NotLoggedIn: FunctionComponent = () => {
  const {
    actions: { signInClicked },
  } = useOvermind();

  return (
    <Collapsible defaultOpen title="GitHub">
      <Element paddingX={2}>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text block size={2} variant="muted">
            You need to be signed in to export this sandbox to GitHub and make
            commits and pull requests to it.
          </Text>
        </Stack>

        <Button
          onClick={() => signInClicked({ useExtraScopes: false })}
          variant="primary"
        >
          Sign in with GitHub
        </Button>
      </Element>
    </Collapsible>
  );
};
