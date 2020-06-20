import { Button, Stack, Text } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React from 'react';

export const ConflictsSource = ({
  originalGit,
  baseGit,
  prNumber,
  originalGitCommitSha,
}) => {
  const { effects } = useOvermind();
  return (
    <Stack direction="vertical">
      <Text size={3} paddingBottom={4} style={{ lineHeight: '19px' }}>
        <Text variant="muted">You are in conflict with changes on </Text>
        {prNumber ? 'PR' : originalGit.branch}
        <Text variant="muted">
          , please resolve the conflicts and commit your changes
        </Text>
      </Text>
      <Button
        variant="secondary"
        onClick={() => {
          effects.browser.openWindow(
            `https://github.com/${originalGit.username}/${originalGit.repo}/compare/${originalGitCommitSha}...${originalGit.branch}`
          );
        }}
      >
        View Changes on GitHub
      </Button>
    </Stack>
  );
};
