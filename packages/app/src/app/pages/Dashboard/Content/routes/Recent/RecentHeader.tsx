import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Text, Icon } from '@codesandbox/components';
import { SubscriptionStatus, SubscriptionType } from 'app/graphql/types';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { UpgradeBanner } from 'app/pages/Dashboard/Components/UpgradeBanner';
import React from 'react';
import styled from 'styled-components';

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
      <EmptyPage.StyledGrid css={{ gridAutoRows: 'auto' }}>
        <ButtonInverseLarge
          onClick={() => {
            track('Empty State Card - Open create modal', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'get-started-action',
              tab: 'github',
            });
            actions.openCreateSandboxModal({ initialTab: 'import' });
          }}
        >
          <Icon name="sandbox" /> New sandbox
        </ButtonInverseLarge>
        <ButtonInverseLarge
          onClick={() => {
            track('Empty State Card - Open create modal', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'get-started-action',
              tab: 'github',
            });
            actions.openCreateSandboxModal({ initialTab: 'import' });
          }}
        >
          <Icon name="github" /> Import repository
        </ButtonInverseLarge>

        {isTeamSpace && !isTeamViewer ? (
          <ButtonInverseLarge
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
          >
            <Icon name="team" /> Invite team members
          </ButtonInverseLarge>
        ) : null}

        {isPersonalSpace ? (
          <ButtonInverseLarge
            onClick={() => {
              track('Empty State Card - Create team', {
                codesandbox: 'V1',
                event_source: 'UI',
                card_type: 'get-started-action',
              });
              actions.openCreateTeamModal();
            }}
          >
            <Icon name="team" /> Create team
          </ButtonInverseLarge>
        ) : null}
      </EmptyPage.StyledGrid>
    </Stack>
  );
};

type ButtonInverseLargeProps = {
  children: React.ReactNode;
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

// TODO: Add the Button component variant below to the design system.
// naming: [component][variant][size]
const ButtonInverseLarge = ({ children, onClick }: ButtonInverseLargeProps) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

const StyledButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  gap: 24px; // In case of icons
  padding: 20px 24px;
  border-radius: 4px;
  background-color: #ffffff;
  color: #0e0e0e;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;

  &:hover {
    background-color: #ebebeb;
    cursor: pointer;
    transition: background-color 75ms ease;
  }

  &:focus-visible {
    outline: 2px solid #9581ff;
  }
`;
