import React, { useEffect } from 'react';
import { Button, Icon, Stack, Text } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';

export const AuthorizeGitHubPermissions = () => {
  const { signInGithubClicked } = useActions();

  useEffect(() => {
    track('Import repo - Permissions - Display');
  }, []);

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
            track('Import repo - Permissions - Authorize all');
          }}
        >
          Authorize access to public and private repositories
        </Button>
        <Button
          variant="secondary"
          size="large"
          onClick={() => {
            signInGithubClicked('public_repos');
            track('Import repo - Permissions - Authorize public');
          }}
        >
          Authorize access to public repositories only
        </Button>
      </Stack>
    </Stack>
  );
};
