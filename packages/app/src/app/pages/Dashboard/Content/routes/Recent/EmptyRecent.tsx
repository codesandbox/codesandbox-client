import React from 'react';
import { Stack, Text, Button } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

import { useAppState, useActions } from 'app/overmind';
import { ContentSection } from 'app/pages/Dashboard/Components/shared/ContentSection';
import { RestrictedSandboxes } from 'app/components/StripeMessages/RestrictedSandboxes';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { StyledContentWrapper } from 'app/pages/Dashboard/Components/shared/elements';

import { CreateBranchesRow } from './CreateBranchesRow';
import { TopBanner } from './TopBanner';

export const EmptyRecent: React.FC = () => {
  const { sidebar, activeTeam } = useAppState();
  const { hasReachedSandboxLimit, isFrozen } = useWorkspaceLimits();

  const workspaceRepositories = sidebar[activeTeam]?.repositories || [];
  const hasWorkspaceRepositories = workspaceRepositories.length > 0;

  return (
    <StyledContentWrapper>
      <Stack direction="vertical" gap={4}>
        {hasReachedSandboxLimit && <RestrictedSandboxes />}
        <TopBanner />
      </Stack>

      <ContentSection title="Recent">
        <EmptyCTAs isFrozen={isFrozen} />
      </ContentSection>

      {hasWorkspaceRepositories && (
        <ContentSection title="Explore workspace activity">
          <CreateBranchesRow
            title="Start working on existing repositories"
            repos={workspaceRepositories}
            isFrozen={isFrozen}
            trackEvent="Recent Page - Explore workspace - Create new branch"
          />
        </ContentSection>
      )}
    </StyledContentWrapper>
  );
};

const EmptyCTAs: React.FC<{ isFrozen: boolean }> = ({ isFrozen }) => {
  const actions = useActions();

  return (
    <Stack direction="vertical" align="center" gap={4}>
      <Text size={6}>You have no recent work</Text>
      <Stack gap={2}>
        <Button
          onClick={() => {
            track('Empty Recent - Explore templates');
            actions.modalOpened({ modal: 'createDevbox' });
          }}
          disabled={isFrozen}
          variant="secondary"
          autoWidth
        >
          Explore templates
        </Button>
        <Button
          onClick={() => {
            track('Empty Recent - Import repository');
            actions.modalOpened({ modal: 'importRepository' });
          }}
          disabled={isFrozen}
          variant="secondary"
          autoWidth
        >
          Import repository
        </Button>
      </Stack>
    </Stack>
  );
};
