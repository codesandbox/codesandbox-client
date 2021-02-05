import {
  Button,
  Collapsible,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import { useActions } from 'app/overmind';
import React from 'react';

export const ClosedPr: React.FC = () => {
  const { openSourceSandbox } = useActions().git;
  return (
    <Collapsible title="GitHub" defaultOpen>
      <Element paddingX={2}>
        <Stack direction="vertical">
          <Text size={3} paddingBottom={4}>
            <Text variant="muted">This </Text> PR
            <Text variant="muted">
              {' '}
              has been closed. To create new changes, go back to the GitHub
              sandbox and create a new fork.{' '}
            </Text>
          </Text>
          <Button onClick={openSourceSandbox}>Open GitHub Sandbox</Button>
        </Stack>
      </Element>
    </Collapsible>
  );
};
