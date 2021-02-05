import React from 'react';

import {
  Element,
  Collapsible,
  Stack,
  Text,
  Button,
} from '@codesandbox/components';
import { useActions } from 'app/overmind';

export const NotLoggedIn = () => {
  const { toggleSignInModal } = useActions();

  return (
    <Collapsible title="GitHub" defaultOpen>
      <Element paddingX={2}>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text size={2} variant="muted" block>
            You need to be signed in to export this sandbox to GitHub and make
            commits and pull requests to it.
          </Text>
        </Stack>
        <Button variant="primary" onClick={() => toggleSignInModal()}>
          Sign in
        </Button>
      </Element>
    </Collapsible>
  );
};
