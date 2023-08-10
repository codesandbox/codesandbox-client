import React from 'react';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  Text,
  SkeletonText,
} from '@codesandbox/components';
import { Navigation } from 'app/pages/common/Navigation';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  ORG_FEATURES,
  TEAM_PRO_FEATURES_WITH_PILLS,
  PERSONAL_FREE_FEATURES,
} from 'app/constants';
import { formatCurrency } from 'app/utils/currency';

import { useCurrencyFromTimeZone } from 'app/hooks/useCurrencyFromTimeZone';
import { SubscriptionCard } from './components/SubscriptionCard';
import type { CTA } from './components/SubscriptionCard';
import { StyledPricingDetailsText } from './components/elements';
import { NewTeamModal } from '../Dashboard/Components/NewTeamModal';

export const ProCreate = () => {
  const { hasLoadedApp, isLoggedIn, pro } = useAppState();
  const currency = useCurrencyFromTimeZone();
  const { openCreateTeamModal } = useActions();

  if (!hasLoadedApp || !isLoggedIn) return null;

  // TODO: Check if user is eligible for trial
  const newWorkspaceCTA: CTA = {
    text: 'Start trial',
    variant: 'dark',
    onClick: () => {
      openCreateTeamModal();
    },
  };

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
    <ThemeProvider>
      <Helmet>
        <title>Pro - CodeSandbox</title>
      </Helmet>
      <Element
        css={{
          backgroundColor: '#0E0E0E',
          color: '#E5E5E5',
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <Navigation showActions={false} />

        <Element css={{ height: '48px' }} />

        <Stack gap={10} direction="vertical">
          <Stack gap={3} direction="vertical" align="center">
            <Element css={{ maxWidth: '976px', textAlign: 'center' }}>
              <Text
                as="h1"
                fontFamily="everett"
                size={48}
                weight="500"
                align="center"
                lineHeight="56px"
                margin={0}
              >
                Unlock more with Pro
              </Text>
            </Element>
          </Stack>

          <Stack
            gap={2}
            justify="center"
            css={{
              // The only way to change the stack styles responsively
              // with CSS rules only.
              '@media (max-width: 888px)': {
                flexDirection: 'column',
                alignItems: 'center',
                '& > *:not(:last-child)': {
                  marginRight: 0,
                  marginBottom: '8px',
                },
              },
            }}
          >
            <SubscriptionCard
              title="Community"
              features={PERSONAL_FREE_FEATURES}
            >
              <Stack gap={1} direction="vertical">
                <Text size={32} weight="400">
                  Free
                </Text>
                <StyledPricingDetailsText>
                  personal space
                </StyledPricingDetailsText>
              </Stack>
            </SubscriptionCard>

            <SubscriptionCard
              title="Pro"
              features={TEAM_PRO_FEATURES_WITH_PILLS}
              isHighlighted
              cta={newWorkspaceCTA}
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

            <SubscriptionCard
              title="Organization"
              features={ORG_FEATURES}
              cta={{
                text: 'Contact us',
                href: 'https://codesandbox.typeform.com/organization',
                variant: 'dark',
                onClick: () => {
                  track('subscription page - contact us', {
                    codesandbox: 'V1',
                    event_source: 'UI',
                  });
                },
              }}
              isHighlighted={false}
            >
              <Stack gap={1} direction="vertical">
                <Text size={32} weight="400">
                  Custom
                </Text>
                <StyledPricingDetailsText>
                  <div>tailor-made plan.</div>
                  <div>bulk pricing for seats.</div>
                </StyledPricingDetailsText>
              </Stack>
            </SubscriptionCard>
          </Stack>
        </Stack>
      </Element>
      <NewTeamModal />
    </ThemeProvider>
  );
};
