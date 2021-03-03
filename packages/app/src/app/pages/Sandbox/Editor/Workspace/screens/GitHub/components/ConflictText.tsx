import { Button, Stack, Text } from '@codesandbox/components';
import { useAppState, useActions, useEffects } from 'app/overmind';
import React from 'react';

export const OutOfSync: React.FC = () => {
  const {
    git: { isResolving },
    editor: {
      currentSandbox: { originalGit, originalGitCommitSha, prNumber },
    },
  } = useAppState();
  const { resolveOutOfSync } = useActions().git;
  const effects = useEffects();

  return (
    <Stack direction="vertical">
      <Text size={3} paddingBottom={4} style={{ lineHeight: '19px' }}>
        <Text variant="muted">You are out of sync with changes in </Text>
        {prNumber ? 'PR' : originalGit.branch}
        <Text variant="muted">
          , though you can safely just update the sandbox
        </Text>
      </Text>
      <Button
        loading={isResolving}
        onClick={() => {
          resolveOutOfSync();
        }}
      >
        Update sandbox from {prNumber ? 'PR' : originalGit.branch}
      </Button>
      <Button
        marginTop={4}
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

export const OutOfSyncPR: React.FC = () => {
  const {
    git: { isResolving },
    editor: {
      currentSandbox: { originalGit, baseGit, originalGitCommitSha },
    },
  } = useAppState();
  const { resolveOutOfSync } = useActions().git;
  const effects = useEffects();

  return (
    <Stack direction="vertical">
      <Text size={3} paddingBottom={4} style={{ lineHeight: '19px' }}>
        <Text variant="muted">You are out of sync with changes on </Text>
        {baseGit.branch}
        <Text variant="muted">
          , though you can safely just update the sandbox
        </Text>
      </Text>
      <Button
        loading={isResolving}
        onClick={() => {
          resolveOutOfSync();
        }}
      >
        Update sandbox from {baseGit.branch}
      </Button>
      <Button
        marginTop={4}
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
