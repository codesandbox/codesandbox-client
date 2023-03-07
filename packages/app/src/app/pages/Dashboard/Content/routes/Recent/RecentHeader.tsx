import track from '@codesandbox/common/lib/utils/analytics';
import { CreateCard, Stack, Text } from '@codesandbox/components';
import { SubscriptionStatus, SubscriptionType } from 'app/graphql/types';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { UpgradeBanner } from 'app/pages/Dashboard/Components/UpgradeBanner';
import React from 'react';

export const RecentHeader: React.FC<{ title: string }> = ({ title }) => {
  const actions = useActions();
  const {
    dashboard: { teams },
  } = useAppState();
  const { isFree } = useWorkspaceSubscription();
  const {
    isTeamSpace,
    isPersonalSpace,
    isTeamViewer,
  } = useWorkspaceAuthorization();
  const allTeamsNotOnPro =
    teams.find(
      t =>
        t.subscription &&
        t.subscription.type === SubscriptionType.TeamPro &&
        (t.subscription.status === SubscriptionStatus.Active ||
          t.subscription.status === SubscriptionStatus.Trialing)
    ) === undefined;
  const showUpgradeBanner =
    (isPersonalSpace && allTeamsNotOnPro) || (isFree && isTeamSpace);

  return (
    <Stack direction="vertical" gap={9}>
      {showUpgradeBanner && <UpgradeBanner />}
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
        {isTeamSpace && !isTeamViewer ? (
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
        ) : null}
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
        ) : null}
      </EmptyPage.StyledGrid>
    </Stack>
  );
};
