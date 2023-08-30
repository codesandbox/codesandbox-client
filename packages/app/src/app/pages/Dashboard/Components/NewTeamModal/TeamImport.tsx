import React from 'react';

import { Element, Stack, Text, Button } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { RestrictedPublicReposImport } from 'app/pages/Dashboard/Components/shared/RestrictedPublicReposImport';
import { SuggestedRepositories } from 'app/components/CreateSandbox/Import/SuggestedRepositories';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';

export const TeamImport = ({ onComplete }: { onComplete: () => void }) => {
  const { restrictsPublicRepos } = useGitHubPermissions();

  const handleImportClicked = () => {
    track('New Team - Imported repository', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    onComplete();
  };

  return (
    <Element css={{ width: '100%', height: '546px' }} padding={8}>
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
              <SuggestedRepositories
                isImportOnly
                onImportClicked={handleImportClicked}
              />
            </Element>
          )}
        </Stack>
        <Button
          css={{ width: 'auto' }}
          onClick={() => {
            track('New Team - Skip import', {
              codesandbox: 'V1',
              event_source: 'UI',
            });

            onComplete();
          }}
          variant="link"
        >
          Skip
        </Button>
      </Stack>
    </Element>
  );
};
