import { Stack, Button, Text, Collapsible } from '@codesandbox/components';
import React from 'react';
import { useOvermind } from 'app/overmind';
import { Explorer } from '../Explorer';

export const GithubSummary = () => {
  const {
    state: { editor },
    actions: {
      editor: { forkSandboxClicked },
    },
  } = useOvermind();

  return (
    <>
      <Collapsible title={editor.currentSandbox.git.repo} defaultOpen>
        <Stack
          direction="vertical"
          padding={2}
          paddingBottom={60}
          justify="space-between"
        >
          <Text variant="muted" size={3} paddingBottom={4}>
            This Sandbox is in sync with{' '}
            <Text weight="bold">{editor.currentSandbox.git.branch}</Text> on
            Github. To make changes, fork the Sandbox
          </Text>
          <Button
            variant="primary"
            loading={editor.isForkingSandbox}
            onClick={() => forkSandboxClicked()}
          >
            {editor.isForkingSandbox ? 'Forking...' : 'Fork'}
          </Button>
        </Stack>
      </Collapsible>
      <Explorer readonly />
    </>
  );
};
