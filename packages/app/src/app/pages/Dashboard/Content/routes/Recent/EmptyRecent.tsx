import track from '@codesandbox/common/lib/utils/analytics';
import { CreateCard, Stack, Text } from '@codesandbox/components';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions, useAppState } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import { UpgradeBanner } from 'app/pages/Dashboard/Components/UpgradeBanner';
import React from 'react';
import { DocumentationRow } from './DocumentationRow';
import { InstructionsRow } from './InstructionsRow';
import { OpenSourceRow } from './OpenSourceRow';

export const EmptyRecent: React.FC<{ showUpgradeBanner: boolean }> = ({
  showUpgradeBanner,
}) => {
  const actions = useActions();
  const { activeTeam } = useAppState();
  const { isPersonalSpace } = useWorkspaceAuthorization();

  return (
    <EmptyPage.StyledWrapper
      css={{
        gap: '48px',
        height: 'auto',
        paddingBottom: '64px',
      }}
    >
      <Stack direction="vertical" gap={9}>
        {showUpgradeBanner && <UpgradeBanner teamId={activeTeam} />}
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
          Let&apos;s start building
        </Text>
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
      </Stack>
      <InstructionsRow />
      <TemplatesRow />
      <DocumentationRow />
      {isPersonalSpace ? <OpenSourceRow /> : null}
    </EmptyPage.StyledWrapper>
  );
};
