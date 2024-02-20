import React from 'react';

import { Stack, Text, Icon, Button, Element } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';

export const AuthorizeForSuggested = () => {
  const { signInGithubClicked } = useActions();

  React.useEffect(() => {
    track('Import Repo - Ask for private repo access');
  }, []);

  return (
    <Stack gap={2} align="center">
      <Text variant="muted" size={12}>
        Don&apos;t see all your repositories?
      </Text>
      <Button
        onClick={() => signInGithubClicked('private_repos')}
        variant="link"
        autoWidth
        css={{ padding: 0, cursor: 'pointer' }}
      >
        <Stack gap={1} align="center" css={{ color: '#FFFFFF' }}>
          <Text size={12}>Authorize access to private repositories</Text>
          <Element css={{ marginTop: '2px' }}>
            <Icon css={{ display: 'block' }} name="external" size={12} />
          </Element>
        </Stack>
      </Button>
    </Stack>
  );
};
