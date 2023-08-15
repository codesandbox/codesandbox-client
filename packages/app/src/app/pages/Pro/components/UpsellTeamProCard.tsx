import React from 'react';
import { useActions } from 'app/overmind';
import { ExperimentValues, useExperimentResult } from '@codesandbox/ab';
import { Element, Stack, Text, SkeletonText } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { TEAM_PRO_FEATURES } from 'app/constants';

import { SubscriptionCard } from './SubscriptionCard';
import type { CTA } from './SubscriptionCard';
import { StyledPricingDetailsText } from './elements';
import { usePriceCalculation } from '../usePriceCalculation';

export const UpsellTeamProCard: React.FC<{ trackingLocation: string }> = ({
  trackingLocation,
}) => {
  const experimentPromise = useExperimentResult('pro-page-sticker');
  const { openCreateTeamModal } = useActions();
  const [showSticker, setShowSticker] = React.useState(false);

  const buildEventName = (event: string) => {
    const name = `${trackingLocation} - ${event}`;

    if (showSticker) {
      return `${name} with collaboration sticker`;
    }

    return name;
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

  React.useEffect(() => {
    experimentPromise.then(experiment => {
      setShowSticker(experiment === ExperimentValues.B);
    });
  }, [experimentPromise]);

  const oneSeatPrice = usePriceCalculation({
    billingPeriod: 'year',
    maxSeats: 1,
  });

  const extraSeatsPrice = usePriceCalculation({
    billingPeriod: 'year',
    maxSeats: 3,
  });

  return (
    <Element css={{ position: 'relative' }}>
      {showSticker && (
        <Element
          as="img"
          alt="Optimized for collaboration!"
          css={{
            position: 'absolute',
            right: 0,
            transform: 'translate(50%, -40%)',
            width: '158px',
            height: '180px',
          }}
          src="/static/img/collaboration-sticker.png"
        />
      )}
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
