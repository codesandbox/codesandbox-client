import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { TEAM_PRO_FEATURES_WITH_PILLS } from 'app/constants';
import { formatCurrency } from 'app/utils/currency';

import { SubscriptionCard } from './SubscriptionCard';
import type { CTA } from './SubscriptionCard';
import { StyledPricingDetailsText } from './elements';

export const UpsellTeamPro: React.FC = () => {
  const { pro } = useAppState();
  const { modalOpened } = useActions();

  const upsellTeamProCta: CTA = {
    text: 'Upgrade',
    variant: 'highlight',
    onClick: () => {
      track('subscription page - upsell team pro cta clicked', {
        codesandbox: 'V1',
        event_source: 'UI',
      });
      modalOpened({ modal: 'selectWorkspaceToUpgrade' });
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
