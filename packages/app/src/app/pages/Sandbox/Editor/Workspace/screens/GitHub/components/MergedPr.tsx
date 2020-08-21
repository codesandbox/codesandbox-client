import {
  Button,
  Collapsible,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React from 'react';

export const MergedPr: React.FC = () => {
  const { actions } = useOvermind();
  return (
    <Collapsible title="GitHub" defaultOpen>
      <Element paddingX={2}>
        <Stack direction="vertical">
          <Text size={3} paddingBottom={4}>
            <Text variant="muted">This </Text> PR
            <Text variant="muted">
              {' '}
              has been succesfully merged. To create new changes, go back to the
              GitHub sandbox and create a new fork.{' '}
            </Text>
          </Text>
          <Button onClick={() => actions.git.openSourceSandbox()}>
            Open GitHub Sandbox
          </Button>
        </Stack>
      </Element>
    </Collapsible>
  );
};
