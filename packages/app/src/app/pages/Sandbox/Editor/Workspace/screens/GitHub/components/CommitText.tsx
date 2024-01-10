import { Button, Stack, Text } from '@codesandbox/components';
import { useAppState, useEffects } from 'app/overmind';
import React from 'react';

export const NoPermissions = () => {
  const { originalGit } = useAppState().editor.currentSandbox;

  return (
    <Text size={3} paddingBottom={4}>
      <Text variant="muted">You do not have access to commit directly to </Text>
      {originalGit.branch}
      <Text variant="muted">, please create a </Text>PR{' '}
      <Text variant="muted">after you have made your changes</Text>
    </Text>
  );
};

export const CommitToMaster = () => {
  const { originalGit } = useAppState().editor.currentSandbox;

  return (
    <Text size={3} paddingBottom={4}>
      <Text variant="muted">
        You have access to commit changes directly to{' '}
      </Text>
      {originalGit.branch}
      <Text variant="muted">, but you can also choose to create a </Text>PR
    </Text>
  );
};

export const CommitToPr = () => {
  const { openWindow } = useEffects().browser;
  const {
    originalGit,
    baseGit,
    prNumber,
  } = useAppState().editor.currentSandbox;

  return (
    <Stack direction="vertical">
      <Text size={3} paddingBottom={4}>
        <Text variant="muted">This</Text> PR{' '}
        <Text variant="muted">is pointing to the branch </Text>
        {originalGit.branch}
        <Text variant="muted">, any updates will be committed there.</Text>
      </Text>
      <Button
        variant="secondary"
        onClick={() => {
          openWindow(
            `https://github.com/${baseGit.username}/${baseGit.repo}/pull/${prNumber}`
          );
        }}
      >
        Open PR
      </Button>
    </Stack>
  );
};
