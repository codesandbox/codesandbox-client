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
  FREE_FEATURES,
} from 'app/constants';
import { SubscriptionCard } from './components/SubscriptionCard';
import type { CTA } from './components/SubscriptionCard';
import { StyledPricingDetailsText } from './components/elements';
import { NewTeamModal } from '../Dashboard/Components/NewTeamModal';
import { usePriceCalculation } from './usePriceCalculation';

export const ProCreate = () => {
  const { hasLoadedApp, isLoggedIn } = useAppState();

  const { openCreateTeamModal } = useActions();

  const oneSeatPrice = usePriceCalculation({
    billingPeriod: 'year',
    maxSeats: 1,
  });

  const extraSeatsPrice = usePriceCalculation({
    billingPeriod: 'year',
    maxSeats: 3,
  });

  if (!hasLoadedApp || !isLoggedIn) return null;

  // TODO: Check if user is eligible for trial
  const newWorkspaceCTA: CTA = {
    text: 'Start trial',
    variant: 'dark',
    onClick: () => {
      openCreateTeamModal();
    },
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
            <SubscriptionCard title="Free" features={FREE_FEATURES}>
              <Stack gap={1} direction="vertical">
                <Text size={32} weight="400">
                  $0
                </Text>
                <StyledPricingDetailsText>forever</StyledPricingDetailsText>
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
