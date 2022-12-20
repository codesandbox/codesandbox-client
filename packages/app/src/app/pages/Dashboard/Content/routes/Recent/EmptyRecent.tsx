import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { CreateCard, VideoCard } from '@codesandbox/components';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import { useHistory } from 'react-router-dom';
import React from 'react';
import { DocumentationRow, appendOnboardingTracking } from './DocumentationRow';
import { OpenSourceRow } from './OpenSourceRow';

export const EmptyRecent: React.FC = () => {
  const actions = useActions();
  const history = useHistory();
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
              history.push(dashboard.settings());
            }}
          />
        )}
        <VideoCard
          title="Getting Started with CodeSandbox"
          duration="4:40"
          durationLabel="4 minutes, 40 seconds"
          thumbnail="/static/img/thumbnails/recent_intro.png"
          onClick={() =>
            track('Empty State Card - Content Card', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'intro-video',
            })
          }
          url={appendOnboardingTracking(
            'https://www.youtube.com/watch?v=qcJECnz7vqM'
          )}
        />
      </EmptyPage.StyledGrid>
      <TemplatesRow />
      <DocumentationRow />
      {isPersonalSpace ? <OpenSourceRow /> : null}
    </EmptyPage.StyledWrapper>
  );
};
