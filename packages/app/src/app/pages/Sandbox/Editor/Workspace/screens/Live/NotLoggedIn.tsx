import {
  Button,
  Collapsible,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { useActions } from 'app/overmind';

export const NotLoggedIn: FunctionComponent = () => {
  const { toggleSignInModal } = useActions();

  return (
    <Collapsible title="Live" defaultOpen>
      <Element paddingX={2}>
        <Text block marginBottom={2} weight="medium">
          Collaborate in real-time
        </Text>

        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text block size={2} variant="muted">
            You need to be signed in to open a live session to collaborate with
            others in real time.
          </Text>

          <Text block size={2} variant="muted">
            Sign in to live share this sandbox!
          </Text>
        </Stack>

        <Button onClick={() => toggleSignInModal()} variant="primary">
          Sign in
        </Button>
      </Element>
    </Collapsible>
  );
};
