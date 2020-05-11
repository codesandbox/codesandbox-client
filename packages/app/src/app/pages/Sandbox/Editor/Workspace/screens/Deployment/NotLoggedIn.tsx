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
    <Collapsible title="Deployment" defaultOpen>
      <Element paddingX={2}>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text size={2} variant="muted" block>
            You can deploy a production version of your sandbox using one of our
            supported providers - Netlify or Vercel.
          </Text>
          <Text size={2} variant="muted" block>
            You need to be signed in to deploy this sandbox.
          </Text>
        </Stack>
        <Button variant="primary" onClick={() => signInClicked()}>
          Sign in with GitHub
        </Button>
      </Element>
    </Collapsible>
  );
};
