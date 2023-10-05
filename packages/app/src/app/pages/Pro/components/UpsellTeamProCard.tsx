import React from 'react';
import { useActions } from 'app/overmind';
import { Element, Stack, Text, SkeletonText } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { TEAM_PRO_FEATURES } from 'app/constants';
import { usePriceCalculation } from 'app/hooks/usePriceCalculation';

import { SubscriptionCard } from './SubscriptionCard';
import type { CTA } from './SubscriptionCard';
import { StyledPricingDetailsText } from './elements';

export const UpsellTeamProCard: React.FC<{ trackingLocation: string }> = ({
  trackingLocation,
}) => {
  const { openCreateTeamModal } = useActions();

  const buildEventName = (event: string) => {
    return `${trackingLocation} - ${event}`;
  };

  const upsellTeamProCta: CTA = {
    text: 'Upgrade',
    variant: 'highlight',
    onClick: () => {
      track(buildEventName('upsell team pro create team clicked'), {
        codesandbox: 'V1',
        event_source: 'UI',
      });
      openCreateTeamModal();
    },
  };

  const oneSeatPrice = usePriceCalculation({
    billingInterval: 'year',
    maxSeats: 1,
  });

  const extraSeatsPrice = usePriceCalculation({
    billingInterval: 'year',
    maxSeats: 3,
  });

  return (
    <Element css={{ position: 'relative' }}>
      <SubscriptionCard
        title="Pro"
        features={TEAM_PRO_FEATURES}
        isHighlighted
        cta={upsellTeamProCta}
      >
        <Stack gap={1} direction="vertical">
          <Text size={32} weight="500">
            {oneSeatPrice || (
              <SkeletonText css={{ width: '60px', height: '40px' }} />
            )}
          </Text>
          <StyledPricingDetailsText>
            per editor per month,
            <br /> **
            {extraSeatsPrice || (
              <SkeletonText
                css={{
                  display: 'inline-block',
                  marginBottom: '-4px',
                  width: '20px',
                }}
              />
            )}{' '}
            extra for the 2nd and 3rd editor
          </StyledPricingDetailsText>
        </Stack>
      </SubscriptionCard>
    </Element>
  );
};
