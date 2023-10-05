import React from 'react';

import { Element, Stack, Text, Button } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { RestrictedPublicReposImport } from 'app/pages/Dashboard/Components/shared/RestrictedPublicReposImport';
import { SuggestedRepositories } from 'app/components/CreateSandbox/Import/SuggestedRepositories';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';

export const TeamImport = ({ onComplete }: { onComplete: () => void }) => {
  const { restrictsPublicRepos } = useGitHubPermissions();

  return (
    <Element css={{ width: '100%' }} padding={12}>
      <Stack
        align="center"
        direction="vertical"
        gap={12}
        justify="space-between"
        css={{ height: '100%', width: '100%' }}
      >
        <Stack
          align="center"
          direction="vertical"
          gap={12}
          css={{ width: '100%' }}
        >
          <Text
            as="h2"
            size={32}
            weight="500"
            align="center"
            css={{
              margin: 0,
              color: '#ffffff',
              fontFamily: 'Everett, sans-serif',
              lineHeight: '42px',
              letterSpacing: '-0.01em',
            }}
          >
            Import from GitHub
          </Text>
          {restrictsPublicRepos ? (
            <RestrictedPublicReposImport />
          ) : (
            <Element css={{ width: '100%' }}>
              <SuggestedRepositories isImportOnly />
            </Element>
          )}
        </Stack>
        <Stack css={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            css={{ width: 'auto' }}
            onClick={() => {
              track('New Team - Done import', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              onComplete();
            }}
            variant="link"
          >
            Done
          </Button>
        </Stack>
      </Stack>
    </Element>
  );
};
