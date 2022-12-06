import React, { useEffect } from 'react';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { useAppState, useActions } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  Text,
  Icon,
} from '@codesandbox/components';
import { Helmet } from 'react-helmet';
import { Navigation } from 'app/pages/common/Navigation';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { sortBy } from 'lodash-es';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useLocation } from 'react-router-dom';
import {
  ORG_FEATURES,
  TEAM_FREE_FEATURES,
  TEAM_PRO_FEATURES,
  TEAM_PRO_FEATURES_WITH_PILLS,
  PERSONAL_FREE_FEATURES,
  PERSONAL_FEATURES,
  PERSONAL_FEATURES_WITH_PILLS,
} from 'app/constants';

import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { Switcher } from './components/Switcher';
import { SubscriptionPaymentProvider } from '../../graphql/types';
import { SubscriptionCard } from './components/SubscriptionCard';

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

  const { isPersonalSpace, isTeamAdmin } = useWorkspaceAuthorization();
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
    team_id: isTeamAdmin && isFree ? activeTeam : undefined,
    success_path: dashboardUrls.settings(activeTeam),
    cancel_path: '/pro',
    // recurring_interval: 'year', // TODO: defaulting to year does not enable the interval switch in stripe
  });

  const [
    isCustomerPortalLoading,
    createCustomerPortal,
  ] = useCreateCustomerPortal({ team_id: activeTeam });

  const personalProCta: React.ComponentProps<
    typeof SubscriptionCard
  >['cta'] = isPro
    ? {
        text: 'Manage subscription',
        onClick: createCustomerPortal,
        variant: 'light',
        isLoading: isCustomerPortalLoading,
      }
    : {
        text: 'Proceed to checkout',
        href: checkout.state === 'READY' ? checkout.url : undefined, // TODO: Fallback?
        variant: 'highlight',
        isLoading: checkout.state === 'LOADING',
      };

  const teamProCta: React.ComponentProps<typeof SubscriptionCard>['cta'] =
    // eslint-disable-next-line no-nested-ternary
    hasCustomSubscription || !isTeamAdmin
      ? undefined
      : isPro
      ? {
          text: 'Manage subscription',
          onClick: createCustomerPortal,
          variant: 'light',
          isLoading: isCustomerPortalLoading,
        }
      : {
          text: 'Proceed to checkout',
          href: checkout.state === 'READY' ? checkout.url : undefined, // TODO: Fallback?
          variant: 'highlight',
          isLoading: checkout.state === 'LOADING',
        };

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
              setActiveTeam={setActiveTeam}
              personalWorkspaceId={personalWorkspaceId}
              activeTeamInfo={activeTeamInfo}
            />

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
                ? 'You have an active Pro subscription.'
                : 'Upgrade for Pro features'}
            </Text>
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
              features={
                isPersonalSpace ? PERSONAL_FREE_FEATURES : TEAM_FREE_FEATURES
              }
            >
              <Stack gap={1} direction="vertical" css={{ flexGrow: 1 }}>
                <Text aria-hidden size={32} weight="400">
                  $0
                </Text>
                <VisuallyHidden>Zero dollar</VisuallyHidden>
                <Text>forever</Text>
              </Stack>
            </SubscriptionCard>

            {isPersonalSpace ? (
              <SubscriptionCard
                title="Personal Pro"
                features={
                  isPro ? PERSONAL_FEATURES : PERSONAL_FEATURES_WITH_PILLS
                }
                cta={personalProCta}
                isHighlighted
              >
                <Stack gap={1} direction="vertical">
                  <Text aria-hidden size={32} weight="500">
                    $9
                  </Text>
                  <VisuallyHidden>Nine dollars</VisuallyHidden>
                  <Text>
                    <div>per month, billed anually</div>{' '}
                    <div>or $12 per month.</div>
                  </Text>
                </Stack>
              </SubscriptionCard>
            ) : (
              <>
                <SubscriptionCard
                  title="Team Pro"
                  features={
                    isPro ? TEAM_PRO_FEATURES : TEAM_PRO_FEATURES_WITH_PILLS
                  }
                  cta={teamProCta}
                  isHighlighted={!hasCustomSubscription}
                >
                  <Stack gap={1} direction="vertical">
                    <Text aria-hidden size={32} weight="500">
                      $15
                    </Text>
                    <VisuallyHidden>Fifteen dollars</VisuallyHidden>
                    <Text>
                      per editor per month, billed anually, or $18 per month.
                    </Text>
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
                        }
                      : {
                          text: 'Contact us',
                          href: 'https://codesandbox.typeform.com/organization',
                          variant: 'dark',
                        }
                  }
                  isHighlighted={hasCustomSubscription}
                >
                  <Stack gap={1} direction="vertical" css={{ flexGrow: 1 }}>
                    <Text aria-hidden size={32} weight="400">
                      custom
                    </Text>
                    <Text>
                      <div>tailor-made plan.</div>
                      <div>bulk pricing for seats.</div>
                    </Text>
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
    </ThemeProvider>
  );
};
