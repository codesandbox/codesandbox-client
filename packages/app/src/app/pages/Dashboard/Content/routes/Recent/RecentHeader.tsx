import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Text } from '@codesandbox/components';
import { LargeCTAButton } from 'app/components/dashboard/LargeCTAButton';
import { useActions } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { UpgradeBanner } from 'app/pages/Dashboard/Components/UpgradeBanner';
import React from 'react';

export const RecentHeader: React.FC<{ title: string }> = ({ title }) => {
  const actions = useActions();

  return (
    <Stack direction="vertical" gap={9}>
      <UpgradeBanner />
      <Text
        as="h1"
        css={{
          fontWeight: 400,
          fontSize: '24px',
          lineHeight: '32px',
          letterSpacing: '-0.019em',
          color: '#FFFFFF',
          margin: 0,
        }}
      >
        {title}
      </Text>
      <Text as="h2" lineHeight="25px" margin={0} size={16} weight="400">
        Start something new
      </Text>
      <EmptyPage.StyledGrid
        css={{
          gridAutoRows: 'auto',
          gridTemplateColumns: 'repeat(auto-fill, minmax(370px,1fr))',
        }}
      >
        <LargeCTAButton
          icon="boxRepository"
          title="Connect a repository"
          subtitle="Run any branch instantly, create and review PRs in our Cloud Development Environment."
          onClick={() => {
            track('Recent Page - Import Repository', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            actions.modalOpened({ modal: 'importRepository' });
          }}
          variant="primary"
        />

        <LargeCTAButton
          icon="boxDevbox"
          title="Create a Devbox"
          subtitle="Build and share standalone projects of any size in our Cloud Development Environment."
          onClick={() => {
            track('Recent Page - Create Devbox', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            actions.modalOpened({ modal: 'createDevbox' });
          }}
          variant="primary"
        />

        <LargeCTAButton
          icon="boxSandbox"
          title="Create a Sandbox"
          subtitle="Create simple front-end prototypes for free, running the code your browser."
          onClick={() => {
            track('Recent Page - Create Sandbox', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            actions.openCreateSandboxModal();
          }}
          variant="secondary"
        />
      </EmptyPage.StyledGrid>
    </Stack>
  );
};
