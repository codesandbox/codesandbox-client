import React from 'react';
import { Helmet } from 'react-helmet';
import { useAppState } from 'app/overmind';
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
  ORGANIZATION_CONTACT_LINK,
} from 'app/constants';
import { usePriceCalculation } from 'app/hooks/usePriceCalculation';
import { SubscriptionCard } from './components/SubscriptionCard';
import { PricingTable } from './components/PricingTable';
import { StyledPricingDetailsText } from './components/elements';
import { NewTeamModal } from '../Dashboard/Components/NewTeamModal';
import { TeamSubscriptionOptions } from '../Dashboard/Components/TeamSubscriptionOptions/TeamSubscriptionOptions';

export const ProCreate = () => {
  const { hasLoadedApp, isLoggedIn } = useAppState();

  const oneSeatPrice = usePriceCalculation({
    billingInterval: 'year',
    maxSeats: 1,
  });

  const extraSeatsPrice = usePriceCalculation({
    billingInterval: 'year',
    maxSeats: 3,
  });

  if (!hasLoadedApp || !isLoggedIn) return null;

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
              customCta={
                <TeamSubscriptionOptions
                  buttonVariant="dark"
                  buttonStyles={{
                    padding: '12px 20px !important', // Otherwise it gets overridden.
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 500,
                    height: 'auto',
                  }}
                  createTeam
                  trackingLocation="pro_page"
                />
              }
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
                href: ORGANIZATION_CONTACT_LINK,
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
        <PricingTable />
      </Element>
      <NewTeamModal />
    </ThemeProvider>
  );
};
