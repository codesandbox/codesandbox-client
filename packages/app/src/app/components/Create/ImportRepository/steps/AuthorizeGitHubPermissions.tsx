import React from 'react';
import { ComboButton, Stack, Text } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';

export const AuthorizeGitHubPermissions = () => {
  const { signInGithubClicked } = useActions();
  const { isLoadingGithub } = useAppState();

  return (
    <Stack direction="vertical" gap={8}>
      <Stack direction="vertical" gap={4}>
        <Text size={3}>
          To create commits and branches on your GitHub repositories, <br />
          you must grant CodeSandbox permissions to access those repositories.
        </Text>
        <ComboButton
          variant="primary"
          disabled={isLoadingGithub}
          onClick={() => signInGithubClicked('private_repos')}
          options={
            <>
              <ComboButton.Item
                onSelect={() => signInGithubClicked('private_repos')}
              >
                Authorize access to all repositories{' '}
              </ComboButton.Item>
              <ComboButton.Item
                onSelect={() => signInGithubClicked('public_repos')}
              >
                Authorize access only to public repositories{' '}
              </ComboButton.Item>
            </>
          }
        >
          Authorize access to all repositories{' '}
        </ComboButton>
      </Stack>
    </Stack>
  );
};
