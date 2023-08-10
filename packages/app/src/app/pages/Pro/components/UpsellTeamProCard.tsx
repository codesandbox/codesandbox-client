import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { ExperimentValues, useExperimentResult } from '@codesandbox/ab';
import { Element, Stack, Text, SkeletonText } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { TEAM_PRO_FEATURES_WITH_PILLS } from 'app/constants';
import { formatCurrency } from 'app/utils/currency';
import { getUpgradeableTeams } from 'app/utils/teams';
import { useCurrencyFromTimeZone } from 'app/hooks/useCurrencyFromTimeZone';

import { SubscriptionCard } from './SubscriptionCard';
import type { CTA } from './SubscriptionCard';
import { StyledPricingDetailsText } from './elements';

export const UpsellTeamProCard: React.FC<{ trackingLocation: string }> = ({
  trackingLocation,
}) => {
  const experimentPromise = useExperimentResult('pro-page-sticker');
  const { dashboard, pro, user } = useAppState();
  const { modalOpened, openCreateTeamModal } = useActions();
  const [showSticker, setShowSticker] = React.useState(false);
  const currency = useCurrencyFromTimeZone();

  const upgradeableTeams = getUpgradeableTeams({
    teams: dashboard.teams,
    userId: user?.id,
  });

  const buildEventName = (event: string) => {
    const name = `${trackingLocation} - ${event}`;

    if (showSticker) {
      return `${name} with collaboration sticker`;
    }

    return name;
  };

  const upsellTeamProCta: CTA =
    upgradeableTeams.length > 0
      ? {
          text: 'Upgrade',
          variant: 'highlight',
          onClick: () => {
            track(buildEventName('upsell team pro upgrade clicked'), {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            modalOpened({ modal: 'selectWorkspaceToUpgrade' });
          },
        }
      : {
          text: 'Create team and Upgrade',
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

  const getPricePerMonth = (
    type: 'individual' | 'team',
    period: 'year' | 'month'
  ) => {
    if (!pro?.prices) {
      return null; // still loading
    }

    let priceInCurrency =
      pro.prices?.[type]?.[period]?.[currency.toLowerCase()];

    const hasPriceInCurrency = priceInCurrency !== null && priceInCurrency >= 0;

    if (!hasPriceInCurrency) {
      // Fallback to USD
      priceInCurrency = pro?.prices?.[type]?.[period]?.usd;
    }

    // Divide by 12 if the period is year to get monthly price for yearly
    // subscriptions
    const price = period === 'year' ? priceInCurrency / 12 : priceInCurrency;

    // The formatCurrency function will divide the amount by 100
    return formatCurrency({
      currency: hasPriceInCurrency ? currency : 'USD',
      amount: price,
    });
  };

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
        features={TEAM_PRO_FEATURES_WITH_PILLS}
        isHighlighted
        cta={upsellTeamProCta}
      >
        <Stack gap={1} direction="vertical">
          <Text size={32} weight="500">
            {pro?.prices ? (
              getPricePerMonth('team', 'year')
            ) : (
              <SkeletonText css={{ width: '60px', height: '40px' }} />
            )}
          </Text>
          <StyledPricingDetailsText>
            per editor per month,
            <br /> billed annually, or{' '}
            {pro?.prices ? (
              getPricePerMonth('team', 'month')
            ) : (
              <SkeletonText
                css={{
                  display: 'inline-block',
                  marginBottom: '-4px',
                  width: '20px',
                }}
              />
            )}{' '}
            per month.
          </StyledPricingDetailsText>
        </Stack>
      </SubscriptionCard>
    </Element>
  );
};
