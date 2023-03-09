import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { sortBy } from 'lodash-es';
import { useAppState, useActions } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  Text,
  Icon,
} from '@codesandbox/components';
import { Navigation } from 'app/pages/common/Navigation';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  ORG_FEATURES,
  TEAM_FREE_FEATURES,
  TEAM_PRO_FEATURES,
  TEAM_PRO_FEATURES_WITH_PILLS,
  PERSONAL_FREE_FEATURES,
  PERSONAL_FEATURES,
  PERSONAL_FEATURES_WITH_PILLS,
} from 'app/constants';
import { formatCurrency } from 'app/utils/currency';

import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { Switcher } from './components/Switcher';
import { SubscriptionPaymentProvider } from '../../graphql/types';
import { SubscriptionCard } from './components/SubscriptionCard';
import { UpsellTeamProCard } from './components/UpsellTeamProCard';
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
    activeTeamInfo,
    activeTeam,
    dashboard,
    hasLoadedApp,
    isLoggedIn,
    personalWorkspaceId,
    pro,
  } = useAppState();
  const location = useLocation();

  useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  useEffect(() => {
    const personal = location.search.includes('personal');
    const team = location.search.includes('team');

    if (personal) {
      setActiveTeam({ id: personalWorkspaceId });
    } else if (team) {
      setActiveTeam({
        id: dashboard?.teams?.find(
          ({ id, subscription }) =>
            id !== personalWorkspaceId && subscription === null
        )?.id,
      });
    }
  }, [hasLoadedApp, location, setActiveTeam, personalWorkspaceId, dashboard]);

  const {
    isPersonalSpace,
    isTeamSpace,
    isTeamAdmin,
    isAdmin,
  } = useWorkspaceAuthorization();
  const { isFree, isPro } = useWorkspaceSubscription();
  // const isFree = false; // DEBUG
  // const isPro = true; // DEBUG

  /**
   * There is currently no way to know if teams have a custom subscription. This means we will
   * always show the manage subscription button for the pro tier, together with the link to TypeForm
   * to upgrade to a custom subscription. Keeping this variable here for future reference.
   */
  const hasCustomSubscription = false;

  const checkout = useGetCheckoutURL({
    team_id: isAdmin && isFree ? activeTeam : undefined,
    success_path: dashboardUrls.settings(activeTeam),
    cancel_path: '/pro',
    // recurring_interval: 'year', // TODO: defaulting to year does not enable the interval switch in stripe
  });

  const [
    isCustomerPortalLoading,
    createCustomerPortal,
  ] = useCreateCustomerPortal({ team_id: activeTeam });

  const personalProCta: CTA = isPro
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
    : {
        text: 'Proceed to checkout',
        href: checkout.state === 'READY' ? checkout.url : undefined, // TODO: Fallback?
        variant: 'highlight',
        isLoading: checkout.state === 'LOADING',
        onClick: () => {
          track('subscription page - personal pro checkout', {
            codesandbox: 'V1',
            event_source: 'UI',
          });
        },
      };

  const teamProCta: CTA =
    isTeamAdmin && !hasCustomSubscription && isPro
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

  if (!hasLoadedApp || !isLoggedIn || !activeTeamInfo) return null;

  /**
   * Workspace
   */
  const personalWorkspace = dashboard.teams.find(team => {
    return team.id === personalWorkspaceId;
  })!;

  const workspacesList = [
    personalWorkspace,
    ...sortBy(
      dashboard.teams.filter(team => team.id !== personalWorkspaceId),
      team => team.name.toLowerCase()
    ),
  ];

  const hasAnotherPaymentProvider = dashboard.teams.some(
    team =>
      team.subscription?.paymentProvider === SubscriptionPaymentProvider.Paddle
  );

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
            <Switcher
              workspaces={workspacesList}
              setActiveTeam={payload => {
                track('subscription page - change team', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
                return setActiveTeam(payload);
              }}
              personalWorkspaceId={personalWorkspaceId}
              activeTeamInfo={activeTeamInfo}
            />
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
                {isPro && isPersonalSpace
                  ? 'You have an active Personal Pro subscription'
                  : null}
                {isPro && isTeamSpace
                  ? 'You have an active Team Pro subscription'
                  : null}
                {isFree ? 'Upgrade for Pro features' : null}
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
              title="Free plan"
              subTitle="1 editor only"
              features={
                isPersonalSpace ? PERSONAL_FREE_FEATURES : TEAM_FREE_FEATURES
              }
            >
              <Stack gap={1} direction="vertical">
                <Text size={32} weight="400">
                  $0
                </Text>
                <StyledPricingDetailsText>forever</StyledPricingDetailsText>
              </Stack>
            </SubscriptionCard>

            {isPersonalSpace ? (
              <>
                <SubscriptionCard
                  title="Personal Pro"
                  subTitle="1 editor only"
                  features={
                    isPro ? PERSONAL_FEATURES : PERSONAL_FEATURES_WITH_PILLS
                  }
                  cta={personalProCta}
                  isHighlighted
                >
                  <Stack gap={1} direction="vertical">
                    <Text size={32} weight="500">
                      {formatCurrency({
                        currency: 'USD',
                        amount: pro?.prices?.individual.year.usd / 12,
                      })}
                    </Text>
                    <StyledPricingDetailsText>
                      <div>per month,</div>
                      <div>
                        billed annually, or{' '}
                        {formatCurrency({
                          currency: 'USD',
                          amount: pro?.prices?.individual.month.usd,
                        })}{' '}
                        per month.
                      </div>
                    </StyledPricingDetailsText>
                  </Stack>
                </SubscriptionCard>
                <UpsellTeamProCard trackingLocation="subscription page" />
              </>
            ) : (
              <>
                <SubscriptionCard
                  title="Team Pro"
                  subTitle="Up to 20 editors"
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
                      {formatCurrency({
                        currency: 'USD',
                        amount: pro?.prices?.team.year.usd / 12,
                      })}
                    </Text>
                    <StyledPricingDetailsText>
                      per editor per month,
                      <br /> billed annually, or{' '}
                      {formatCurrency({
                        currency: 'USD',
                        amount: pro?.prices?.team.month.usd,
                      })}{' '}
                      per month.
                    </StyledPricingDetailsText>
                  </Stack>
                </SubscriptionCard>

                <SubscriptionCard
                  title="Organization"
                  subTitle="Unlimited editors"
                  features={ORG_FEATURES}
                  cta={
                    hasCustomSubscription
                      ? {
                          text: 'Contact support',
                          href: 'mailto:support@codesandbox.io',
                          variant: 'light',
                          onClick: () => {
                            track(
                              'subscription page - manage org subscription',
                              {
                                codesandbox: 'V1',
                                event_source: 'UI',
                              }
                            );
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
                      custom
                    </Text>
                    <StyledPricingDetailsText>
                      <div>tailor-made plan.</div>
                      <div>bulk pricing for seats.</div>
                    </StyledPricingDetailsText>
                  </Stack>
                </SubscriptionCard>
              </>
            )}
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
