import React from 'react';
import { Helmet } from 'react-helmet';
import { useAppState } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  Text,
  Badge,
  SkeletonText,
} from '@codesandbox/components';
import { Navigation } from 'app/pages/common/Navigation';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  FREE_FEATURES,
  ORGANIZATION_CONTACT_LINK,
  ORG_FEATURES,
  PRO_FEATURES,
  PRO_FEATURES_WITH_PILLS,
} from 'app/constants';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { usePriceCalculation } from 'app/hooks/usePriceCalculation';
import { SubscriptionCard } from './components/SubscriptionCard';
import type { CTA } from './components/SubscriptionCard';
import { StyledPricingDetailsText } from './components/elements';
import { TeamSubscriptionOptions } from '../Dashboard/Components/TeamSubscriptionOptions/TeamSubscriptionOptions';
import { PricingTable } from './components/PricingTable';
import { UBBWaitlist } from './components/UBBWaitlist';

export const ProUpgrade = () => {
  const {
    activeTeam,
    activeTeamInfo,

    hasLoadedApp,
    isLoggedIn,
  } = useAppState();
  const { isBillingManager } = useWorkspaceAuthorization();
  const { isFree, isPro } = useWorkspaceSubscription();

  /**
   * There is currently no way to know if teams have a custom subscription. This means we will
   * always show the manage subscription button for the pro tier, together with the link to TypeForm
   * to upgrade to a custom subscription. Keeping this variable here for future reference.
   */
  const hasCustomSubscription = false;

  const [
    isCustomerPortalLoading,
    createCustomerPortal,
  ] = useCreateCustomerPortal({
    team_id: activeTeam,
  });

  const oneSeatTeamPrice = usePriceCalculation({
    billingInterval: 'year',
    maxSeats: 1,
  });

  const extraSeatsTeamPrice = usePriceCalculation({
    billingInterval: 'year',
    maxSeats: 3,
  });

  const proCTA: CTA =
    isPro && isBillingManager && !hasCustomSubscription
      ? {
          text: 'Manage subscription',
          onClick: () => {
            track('subscription page - manage pro subscription', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            createCustomerPortal();
          },
          variant: 'light',
          isLoading: isCustomerPortalLoading,
        }
      : null;

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
            <Stack gap={2} direction="horizontal" align="center">
              <Text size={24}>{activeTeamInfo.name}</Text>
              {isPro && <Badge variant="pro">Pro</Badge>}
            </Stack>

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
                {isPro
                  ? 'You have an active Pro subscription'
                  : 'Unlock more with pro'}
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
              features={isPro ? PRO_FEATURES : PRO_FEATURES_WITH_PILLS}
              isHighlighted={!hasCustomSubscription}
              {...(isFree
                ? {
                    customCta: (
                      <TeamSubscriptionOptions
                        buttonVariant="dark"
                        buttonStyles={{
                          padding: '12px 20px !important', // Otherwise it gets overridden.
                          fontSize: '16px',
                          lineHeight: '24px',
                          fontWeight: 500,
                          height: 'auto',
                        }}
                        trackingLocation="pro_page"
                      />
                    ),
                  }
                : {
                    cta: proCTA,
                  })}
            >
              <Stack gap={1} direction="vertical">
                <Text size={32} weight="500">
                  {oneSeatTeamPrice || (
                    <SkeletonText css={{ width: '60px', height: '40px' }} />
                  )}
                </Text>
                <StyledPricingDetailsText>
                  per editor per month,
                  <br /> **
                  {extraSeatsTeamPrice || (
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
              cta={
                hasCustomSubscription
                  ? {
                      text: 'Contact support',
                      href: 'mailto:support@codesandbox.io',
                      variant: 'light',
                      onClick: () => {
                        track('subscription page - manage org subscription', {
                          codesandbox: 'V1',
                          event_source: 'UI',
                        });
                      },
                    }
                  : {
                      text: 'Contact us',
                      href: ORGANIZATION_CONTACT_LINK,
                      variant: 'dark',
                      onClick: () => {
                        track('subscription page - contact us', {
                          codesandbox: 'V1',
                          event_source: 'UI',
                        });
                      },
                    }
              }
              isHighlighted={hasCustomSubscription}
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

          <UBBWaitlist />
        </Stack>

        {isFree && <PricingTable />}
      </Element>
    </ThemeProvider>
  );
};
