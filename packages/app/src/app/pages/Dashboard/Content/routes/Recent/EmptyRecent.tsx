import track from '@codesandbox/common/lib/utils/analytics';
import { CreateCard } from '@codesandbox/components';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import React from 'react';
import { DocumentationRow } from './DocumentationRow';
import { InstructionsRow } from './InstructionsRow';

export const EmptyRecent: React.FC = () => {
  const actions = useActions();
  const { isPersonalSpace } = useWorkspaceAuthorization();

  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledGrid>
        <CreateCard
          icon="plus"
          title="New from a template"
          onClick={() => {
            track('Empty State Card - Open create modal', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'get-started-action',
              tab: 'default',
            });
            actions.openCreateSandboxModal();
          }}
        />
        <CreateCard
          icon="github"
          title="Import from GitHub"
          onClick={() => {
            track('Empty State Card - Open create modal', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'get-started-action',
              tab: 'github',
            });
            actions.openCreateSandboxModal({ initialTab: 'import' });
          }}
        />
        {isPersonalSpace ? (
          <CreateCard
            icon="team"
            title="Create a team"
            onClick={() => {
              track('Empty State Card - Create team', {
                codesandbox: 'V1',
                event_source: 'UI',
                card_type: 'get-started-action',
              });
              actions.openCreateTeamModal();
            }}
          />
        ) : (
          <CreateCard
            icon="addMember"
            title="Invite team members"
            onClick={() => {
              track('Empty State Card - Invite members', {
                codesandbox: 'V1',
                event_source: 'UI',
                card_type: 'get-started-action',
              });
              actions.openCreateTeamModal({
                step: 'members',
                hasNextStep: false,
              });
            }}
          />
        )}
      </EmptyPage.StyledGrid>
      <InstructionsRow />
      <TemplatesRow />
      <DocumentationRow />
    </EmptyPage.StyledWrapper>
  );
};
