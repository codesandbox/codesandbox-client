import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { TEAM_PRO_FEATURES_WITH_PILLS } from 'app/constants';
import { formatCurrency } from 'app/utils/currency';
import { SubscriptionType, TeamMemberAuthorization } from 'app/graphql/types';

import { SubscriptionCard } from './SubscriptionCard';
import type { CTA } from './SubscriptionCard';
import { StyledPricingDetailsText } from './elements';

export const UpsellTeamProCard: React.FC<{ trackingLocation: string }> = ({
  trackingLocation,
}) => {
  const { dashboard, pro, personalWorkspaceId, user } = useAppState();
  const { modalOpened, openCreateTeamModal } = useActions();

  const upgradeableTeams = dashboard.teams.filter(team => {
    if (
      team.id === personalWorkspaceId ||
      team.subscription?.type === SubscriptionType.TeamPro
    ) {
      return false;
    }

    const teamAdmins = team.userAuthorizations
      .filter(
        ({ authorization }) => authorization === TeamMemberAuthorization.Admin
      )
      .map(({ userId }) => userId);

    return teamAdmins.includes(user?.id);
  });

  const upsellTeamProCta: CTA =
    upgradeableTeams.length > 0
      ? {
          text: 'Upgrade',
          variant: 'highlight',
          onClick: () => {
            track(`${trackingLocation} - upsell team pro upgrade clicked`, {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            modalOpened({ modal: 'selectWorkspaceToUpgrade' });
          },
        }
      : {
          text: 'Create team',
          variant: 'highlight',
          onClick: () => {
            track(`${trackingLocation} - upsell team pro create team clicked`, {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            openCreateTeamModal();
          },
        };

  return (
    <SubscriptionCard
      title="Team Pro"
      features={TEAM_PRO_FEATURES_WITH_PILLS}
      isHighlighted
      cta={upsellTeamProCta}
    >
      <Stack gap={1} direction="vertical">
        <Text size={32} weight="500">
          {formatCurrency({
            currency: 'USD',
            amount: pro?.prices?.team.year.usd / 12,
          })}
        </Text>
        <StyledPricingDetailsText>
          per editor per month, billed anually, or{' '}
          {formatCurrency({
            currency: 'USD',
            amount: pro?.prices?.team.month.usd,
          })}{' '}
          per month.
        </StyledPricingDetailsText>
      </Stack>
    </SubscriptionCard>
  );
};
