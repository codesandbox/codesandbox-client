import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Text } from '@codesandbox/components';
import {
  DEVBOX_BUTTON_DESCRIPTION,
  IMPORT_BUTTON_DESCRIPTION,
  SANDBOX_BUTTON_DESCRIPTION,
} from 'app/components/Create/utils/constants';
import { LargeCTAButton } from 'app/components/dashboard/LargeCTAButton';
import { useActions } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { RestrictedSandboxes } from 'app/components/StripeMessages/RestrictedSandboxes';
import { TopBanner } from './TopBanner';

export const RecentHeader: React.FC<{ title: string }> = ({ title }) => {
  const actions = useActions();
  const { isFrozen, hasRestrictedSandboxes } = useWorkspaceLimits();

  return (
    <Stack direction="vertical" gap={8}>
      {hasRestrictedSandboxes && <RestrictedSandboxes />}
      <TopBanner />

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
      <Stack direction="vertical" gap={4}>
        <Text as="h2" lineHeight="25px" margin={0} size={16} weight="400">
          Start a new project
        </Text>
        <EmptyPage.StyledGrid
          css={{
            gridAutoRows: 'auto',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))',
            '@media (min-width: 1585px)': {
              gridTemplateColumns: 'repeat(auto-fill, minmax(370px,1fr))',
            },
          }}
        >
          <LargeCTAButton
            icon="boxRepository"
            title="Import repository"
            disabled={isFrozen}
            subtitle={IMPORT_BUTTON_DESCRIPTION}
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
            disabled={isFrozen}
            subtitle={DEVBOX_BUTTON_DESCRIPTION}
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
            subtitle={SANDBOX_BUTTON_DESCRIPTION}
            onClick={() => {
              track('Recent Page - Create Sandbox', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
              actions.modalOpened({ modal: 'createSandbox' });
            }}
            variant="secondary"
          />
        </EmptyPage.StyledGrid>
      </Stack>
    </Stack>
  );
};
