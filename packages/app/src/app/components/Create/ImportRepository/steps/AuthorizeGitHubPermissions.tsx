import React from 'react';
import { Button, Icon, Stack, Text } from '@codesandbox/components';
import { useActions } from 'app/overmind';

export const AuthorizeGitHubPermissions = () => {
  const { signInGithubClicked } = useActions();

  return (
    <Stack
      direction="vertical"
      gap={8}
      css={{ width: '100%', paddingTop: '64px' }}
      align="center"
    >
      <Icon size={64} name="github" />
      <Text size={48} css={{ fontFamily: 'Everett', fontWeight: '500' }}>
        Authorize GitHub
      </Text>
      <Text>
        CodeSandbox needs access to your repositories in order to create
        branches and commits.
      </Text>
      <Stack direction="vertical" gap={4}>
        <Button
          variant="primary"
          size="large"
          onClick={() => {
            signInGithubClicked('private_repos');
          }}
        >
          Authorize access to public and private repositories
        </Button>
        <Button
          variant="secondary"
          size="large"
          onClick={() => {
            signInGithubClicked('public_repos');
          }}
        >
          Authorize access to public repositories only
        </Button>
      </Stack>
    </Stack>
  );
};
