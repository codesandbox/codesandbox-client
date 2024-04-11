import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { ContentSection } from 'app/pages/Dashboard/Components/shared/ContentSection';
import { RestrictedSandboxes } from 'app/components/StripeMessages/RestrictedSandboxes';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import {
  StyledContentWrapper,
  StyledGrid,
} from 'app/pages/Dashboard/Components/shared/elements';

import { ActionCard } from 'app/pages/Dashboard/Components/shared/ActionCard';
import { CreateBranchesRow } from './CreateBranchesRow';
import { TopBanner } from './TopBanner';
import { DocumentationRow } from './DocumentationRow';
import { InstructionsRow } from './InstructionsRow';

export const EmptyRecent: React.FC = () => {
  const { sidebar, activeTeam } = useAppState();
  const { hasReachedSandboxLimit, isFrozen } = useWorkspaceLimits();

  const workspaceRepositories = sidebar[activeTeam]?.repositories || [];
  const hasWorkspaceRepositories = workspaceRepositories.length > 0;

  return (
    <StyledContentWrapper>
      {hasReachedSandboxLimit && <RestrictedSandboxes />}
      <TopBanner />

      {hasWorkspaceRepositories ? (
        <>
          <ContentSection title="No recent work">
            <EmptyCTAs isFrozen={isFrozen} />
          </ContentSection>

          <ContentSection title="Explore workspace activity">
            <CreateBranchesRow
              repos={workspaceRepositories}
              isFrozen={isFrozen}
            />
          </ContentSection>
        </>
      ) : (
        <ContentSection title="Let's start building">
          <InstructionsRow />
          <DocumentationRow />
        </ContentSection>
      )}
    </StyledContentWrapper>
  );
};

const EmptyCTAs: React.FC<{ isFrozen: boolean }> = ({ isFrozen }) => {
  const { activeTeam } = useAppState();
  const actions = useActions();

  return (
    <Stack direction="vertical" gap={4}>
      <Text as="h3" margin={0} size={4} weight="400">
        Start by creating something
      </Text>
      <StyledGrid>
        <ActionCard
          onClick={() => {
            actions.modalOpened({ modal: 'createDevbox' });
          }}
          icon="boxDevbox"
          disabled={isFrozen}
        >
          <Text weight="500">Explore templates</Text>
        </ActionCard>
        <ActionCard
          onClick={() => {
            actions.modalOpened({ modal: 'importRepository' });
          }}
          icon="boxRepository"
          disabled={isFrozen}
        >
          <Text weight="500">Import repository</Text>
        </ActionCard>
      </StyledGrid>
    </Stack>
  );
};
