import track from '@codesandbox/common/lib/utils/analytics';
import { CreateCard, VideoCard } from '@codesandbox/components';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import React from 'react';
import { DocumentationRow } from './DocumentationRow';

export const EmptyRecent: React.FC = () => {
  const actions = useActions();
  const { isPersonalSpace } = useWorkspaceAuthorization();

  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledGrid>
        <CreateCard
          icon="plus"
          label="New from a template"
          onClick={() => {
            track('Empty State Card - Create Sandbox', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'get-started-action',
            });
            actions.openCreateSandboxModal();
          }}
        />
        <CreateCard
          icon="github"
          label="Import from GitHub"
          onClick={() => {
            track('Empty State Card - Import Repo', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'get-started-action',
            });
            actions.openCreateSandboxModal({ initialTab: 'import' });
          }}
        />
        {isPersonalSpace ? (
          <CreateCard
            icon="addMember"
            label="Create a team"
            onClick={() => {
              track('Empty State Card - Create Team', {
                codesandbox: 'V1',
                event_source: 'UI',
                card_type: 'get-started-action',
              });
              actions.openCreateTeamModal();
            }}
          />
        ) : (
          <CreateCard icon="addMember" label="Invite team members" />
        )}
        <VideoCard
          title="Getting Started with CodeSandbox"
          duration="4:40"
          durationLabel="4 minutes, 40 seconds"
          thumbnail="/static/img/thumbnails/recent_intro.png"
          url="https://www.youtube.com/watch?v=qcJECnz7vqM"
        />
      </EmptyPage.StyledGrid>
      <TemplatesRow page="recent" />
      <DocumentationRow />
    </EmptyPage.StyledWrapper>
  );
};
