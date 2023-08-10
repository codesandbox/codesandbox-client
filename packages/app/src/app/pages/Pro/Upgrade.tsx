import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  Text,
  Icon,
  SkeletonText,
} from '@codesandbox/components';
import { Navigation } from 'app/pages/common/Navigation';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  ORG_FEATURES,
  TEAM_PRO_FEATURES,
  TEAM_PRO_FEATURES_WITH_PILLS,
  PERSONAL_FREE_FEATURES,
} from 'app/constants';
import { formatCurrency } from 'app/utils/currency';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useCurrencyFromTimeZone } from 'app/hooks/useCurrencyFromTimeZone';
import { SubscriptionPaymentProvider } from '../../graphql/types';
import { SubscriptionCard } from './components/SubscriptionCard';
import type { CTA } from './components/SubscriptionCard';
import { StyledPricingDetailsText } from './components/elements';
import { TeamSubscriptionOptions } from '../Dashboard/Components/TeamSubscriptionOptions/TeamSubscriptionOptions';
import { NewTeamModal } from '../Dashboard/Components/NewTeamModal';

export const ProUpgrade = () => {
  const {
    pro: { pageMounted },
    setActiveTeam,
  } = useActions();
  const {
    dashboard,
    hasLoadedApp,
    isLoggedIn,
    personalWorkspaceId,
    pro,
  } = useAppState();
  const location = useLocation();
  const currency = useCurrencyFromTimeZone();
  const searchQuery = new URLSearchParams(location.search);
  const {
    isBillingManager,
    isTeamSpace,
    isPersonalSpace,
  } = useWorkspaceAuthorization();
  const { isPro, isFree, isLegacyPersonalPro } = useWorkspaceSubscription();

  useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  const urlWorkspaceId = searchQuery.get('workspace');

  // Make sure if someone gets the URL with a specific workspaceId,
  // the team is selected in the background for them
  useEffect(() => {
    if (urlWorkspaceId) {
      setActiveTeam({ id: urlWorkspaceId });
    } else {
      setActiveTeam({ id: personalWorkspaceId });
    }
  }, [urlWorkspaceId, personalWorkspaceId]);

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
    team_id: urlWorkspaceId || personalWorkspaceId,
  });

  const teamProCta: CTA =
    isBillingManager && !hasCustomSubscription && isPro
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
      : undefined;

  if (!hasLoadedApp || !isLoggedIn) return null;

  const hasAnotherPaymentProvider = dashboard.teams.some(
    team =>
      team.subscription?.paymentProvider === SubscriptionPaymentProvider.Paddle
  );

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
                {isLegacyPersonalPro
                  ? 'You have an active Personal Pro subscription'
                  : null}
                {isPro && isTeamSpace
                  ? 'You have an active Pro subscription'
                  : null}
                {isFree ? 'Unlock more with pro' : null}
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
            {isPersonalSpace && (
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
            )}
            <SubscriptionCard
              title="Pro"
              features={
                isPro ? TEAM_PRO_FEATURES : TEAM_PRO_FEATURES_WITH_PILLS
              }
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
                        trackingLocation="subscription page"
                      />
                    ),
                  }
                : {
                    cta: teamProCta,
                  })}
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
                      href: 'https://codesandbox.typeform.com/organization',
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
        </Stack>

        {hasAnotherPaymentProvider ? (
          <Stack
            gap={2}
            align="center"
            justify="center"
            css={{ color: '#999999', padding: '32px' }}
          >
            <Icon name="info" size={16} />
            <Text size={3} variant="muted">
              CodeSandbox is migrating to a new payment provider. Previous
              active subscriptions will not be affected.
            </Text>
          </Stack>
        ) : null}
      </Element>
      <NewTeamModal />
    </ThemeProvider>
  );
};
