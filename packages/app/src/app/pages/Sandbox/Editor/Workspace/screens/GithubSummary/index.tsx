import { Button, Collapsible, Stack, Text } from '@codesandbox/components';
import { github as GitHubIcon } from '@codesandbox/components/lib/components/Icon/icons';
import { useOvermind } from 'app/overmind';
import React from 'react';

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
      <Collapsible title="Github Repository" defaultOpen>
        <Stack
          direction="vertical"
          padding={2}
          paddingBottom={60}
          justify="space-between"
        >
          <Stack gap={2} marginBottom={6} align="center">
            <GitHubIcon width={20} />
            <Text size={2}>
              {editor.currentSandbox.git.username}/
              {editor.currentSandbox.git.repo}
            </Text>
          </Stack>
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
