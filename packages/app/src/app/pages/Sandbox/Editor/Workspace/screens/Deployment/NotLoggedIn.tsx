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
    <Collapsible defaultOpen title="Deployment">
      <Element paddingX={2}>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text block size={2} variant="muted">
            You can deploy a production version of your sandbox using one of our
            supported providers - Netlify or Vercel.
          </Text>

          <Text block size={2} variant="muted">
            You need to be signed in to deploy this sandbox.
          </Text>
        </Stack>

        <Button onClick={() => toggleSignInModal()} variant="primary">
          Sign in
        </Button>
      </Element>
    </Collapsible>
  );
};
