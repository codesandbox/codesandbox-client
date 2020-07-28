import { Button, Stack, Text } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React from 'react';

export const ConflictsPRBase = ({
  originalGit,
  baseGit,
  originalGitCommitSha,
}) => {
  const { effects } = useOvermind();
  return (
    <Stack direction="vertical" style={{ lineHeight: '19px' }}>
      <Text size={3} paddingBottom={4}>
        <Text variant="muted">You are in conflict with changes made on </Text>
        {baseGit.branch}
        <Text variant="muted">
          , please resolve the conflicts and update the{' '}
        </Text>{' '}
        PR
      </Text>
      <Button
        variant="secondary"
        onClick={() => {
          effects.browser.openWindow(
            `https://github.com/${originalGit.username}/${originalGit.repo}/compare/${originalGitCommitSha}...${baseGit.branch}`
          );
        }}
      >
        View Changes on GitHub
      </Button>
    </Stack>
  );
};
