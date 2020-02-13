import React from 'react';

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
    <Collapsible title="Live" defaultOpen>
      <Element paddingX={2}>
        <Text block weight="medium" marginBottom={2}>
          Collaborate in real-time
        </Text>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text size={2} variant="muted" block>
            You need to be signed in to open a live session to collaborate with
            others in real time.
          </Text>
          <Text size={2} variant="muted" block>
            Sign in to live share this sandbox!
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
