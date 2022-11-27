import React, { useEffect } from 'react';
import styled from 'styled-components';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { useAppState, useActions } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  Text,
  Badge,
} from '@codesandbox/components';
import { Helmet } from 'react-helmet';
import { Navigation } from 'app/pages/common/Navigation';
// import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { sortBy } from 'lodash-es';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useLocation } from 'react-router-dom';
import {
  Feature,
  FREE_FEATURES,
  ORG_FEATURES,
  PRO_FEATURES,
} from 'app/constants';

// TODO: remove
// import {
//   UpgradeButton,
//   Caption,
//   Summary,
//   BoxPlaceholder,
//   SwitchPlan,
//   PlanTitle,
// } from './components/elements';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { Switcher } from './components/Switcher';
import { SubscriptionPaymentProvider } from '../../graphql/types';

// TODO: move SubscriptionCard
const StyledCard = styled.div<{ isHighlighted?: boolean }>`
  min-width: 222px;
  flex-grow: 0;
  padding: 24px;
  font-size: 13px;

  ${props =>
    props.isHighlighted
      ? `
    background-color: #FFFFFF;
    color: #0E0E0E;
    `
      : `
    background-color: #252525;
    color: #999999;
  `}

  @media (min-width: 887px) {
    width: 320px;
  }
`;

interface SubscriptionCardProps {
  children: React.ReactNode;
  features: Feature[];
  cta?: { text: string; href: string; variant: 'highlight' | 'dark' | 'light' };
  isHighlighted?: boolean;
}

const SubscriptionCard = ({
  children,
  features,
  cta,
  isHighlighted,
}: SubscriptionCardProps) => {
  return (
    <StyledCard
      isHighlighted={isHighlighted}
      as={Stack}
      gap={9}
      direction="vertical"
    >
      {children}
      <Stack
        as="ul"
        direction="vertical"
        gap={1}
        // Reset ul styles
        css={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {features.map(feature => (
          <Stack as="li" justify="space-between" align="center">
            <Text key={feature.key} css={{ padding: '8px 0' }}>
              {feature.label}
            </Text>
            {feature.pill ? (
              <Badge variant="highlight">{feature.pill}</Badge>
            ) : null}
          </Stack>
        ))}
      </Stack>
      {cta ? (
        <StyledSubscriptionLink href={cta.href} variant={cta.variant}>
          {cta.text}
        </StyledSubscriptionLink>
      ) : (
        <Element css={{ height: '48px' }} />
      )}
    </StyledCard>
  );
};

// TODO: Move StyledSubscriptionLink
const subLinkBackgrounds = {
  highlight: { base: '#0E0E0E', hover: '#252525' },
  dark: { base: '#323232', hover: '#292929' },
  light: { base: '#EBEBEB', hover: '#E0E0E0' },
};

const subLinkColors = {
  highlight: { base: '#FFFFFF', hover: '#FFFFFF' },
  dark: { base: '#FFFFFF', hover: '#F5F5F5' },
  light: { base: '#0E0E0E', hover: '#161616' },
};

const StyledSubscriptionLink = styled.a<{
  variant: 'highlight' | 'dark' | 'light';
}>`
  padding: 12px 20px;
  text-align: center;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  border-radius: 4px;
  text-decoration: none;

  ${props => `
    background-color: ${subLinkBackgrounds[props.variant].base};
    color: ${subLinkColors[props.variant].base};
    
    &:hover, &:focus {
      background-color: ${subLinkBackgrounds[props.variant].hover};
      color: ${subLinkColors[props.variant].hover};
    }
  `}

  &:focus {
    outline: 1px solid #ac9cff;
  }
`;

export const ProUpgrade = () => {
  const {
    pro: { pageMounted },
    setActiveTeam,
    openCreateTeamModal,
  } = useActions();
  const {
    activeTeamInfo,
    activeTeam,
    dashboard,
    hasLoadedApp,
    isLoggedIn,
    personalWorkspaceId,
    user,
    pro: { prices },
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

  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { isFree, isPro } = useWorkspaceSubscription();
  // const isFree = false; // DEBUG
  // const isPro = true; // DEBUG
  const { numberOfEditors } = useWorkspaceLimits();

  // TODO: Is ther another way to find out if team has a custom subscription?
  const hasCustomSubscription = numberOfEditors && numberOfEditors > 20;
  // const hasCustomSubscription = true; // DEBUG

  const checkout = useGetCheckoutURL({
    team_id: isTeamAdmin && isFree ? activeTeam : undefined,
    success_path: dashboardUrls.settings(activeTeam),
    cancel_path: '/pro',
  });

  // TODO
  // const [
  //   loadingCustomerPortal,
  //   createCustomerPortal,
  // ] = useCreateCustomerPortal({ team_id: activeTeam });

  if (!hasLoadedApp || !isLoggedIn || !prices || !activeTeamInfo) return null;

  /**
   * Workspace
   */
  const personalWorkspace = dashboard.teams.find(team => {
    return team.id === personalWorkspaceId;
  })!;
  const workspaceType =
    (activeTeamInfo?.id === personalWorkspaceId ? 'pro' : 'teamPro') ?? 'pro';

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

        {hasAnotherPaymentProvider && (
          <Text
            size={3}
            variant="muted"
            css={{
              width: '100%',
              maxWidth: '713px',
              margin: '0 auto',
              display: 'flex',
              padding: '40px 1em 16px',
              alignItems: 'center',
              color: '#808080',
              svg: {
                display: 'none',
                '@media (min-width: 720px)': {
                  display: 'block',
                  marginRight: '.5em',
                },
              },
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 10.625C3.44568 10.625 1.375 8.55432 1.375 6C1.375 3.44568 3.44568 1.375 6 1.375C8.55432 1.375 10.625 3.44568 10.625 6C10.625 8.55432 8.55432 10.625 6 10.625ZM0.625 6C0.625 8.96853 3.03147 11.375 6 11.375C8.96853 11.375 11.375 8.96853 11.375 6C11.375 3.03147 8.96853 0.625002 6 0.625002C3.03147 0.625002 0.625 3.03147 0.625 6ZM6 8.875C6.20711 8.875 6.375 8.70711 6.375 8.5V6C6.375 5.79289 6.20711 5.625 6 5.625C5.79289 5.625 5.625 5.79289 5.625 6V8.5C5.625 8.70711 5.79289 8.875 6 8.875ZM6 4.5C6.2071 4.5 6.375 4.33211 6.375 4.125L6.375 4.0625C6.375 3.8554 6.20711 3.6875 6 3.6875C5.7929 3.6875 5.625 3.85539 5.625 4.0625L5.625 4.125C5.625 4.3321 5.79289 4.5 6 4.5Z"
                fill="#808080"
              />
            </svg>
            CodeSandbox is migrating to a new payment provider. Previous active
            subscriptions will not be affected.
          </Text>
        )}

        <Element css={{ height: '48px' }} />

        <Stack gap={10} direction="vertical">
          <Stack gap={3} direction="vertical" align="center">
            <Switcher
              workspaceType={workspaceType}
              workspaces={workspacesList}
              setActiveTeam={setActiveTeam}
              personalWorkspaceId={personalWorkspaceId}
              activeTeamInfo={activeTeamInfo}
              userId={user.id}
              openCreateTeamModal={openCreateTeamModal}
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
              '@media (max-width: 888px)': {
                // The only way to change the stack styles responsively
                // with CSS rules only.
                display: 'block',
                '& > *:not(:last-child)': {
                  marginRight: 0,
                  marginBottom: '8px',
                },
              },
            }}
          >
            <SubscriptionCard features={FREE_FEATURES}>
              <Text size={16} weight="500">
                Free plan
              </Text>
              <Stack gap={1} direction="vertical" css={{ flexGrow: 1 }}>
                <Text aria-hidden size={32} weight="400">
                  $0
                </Text>
                <VisuallyHidden>Zero dollar</VisuallyHidden>
                <Text>forever</Text>
              </Stack>
            </SubscriptionCard>

            <SubscriptionCard
              features={PRO_FEATURES}
              cta={
                hasCustomSubscription
                  ? undefined
                  : {
                      text: isPro
                        ? 'Manage subscription'
                        : 'Proceed to checkout',
                      // TODO for href: customerPortal link when isPro
                      href:
                        checkout.state === 'READY' ? checkout.url : undefined, // TODO fallback or loading?
                      variant: isPro ? 'light' : 'highlight',
                    }
              }
              isHighlighted={!hasCustomSubscription}
            >
              <Text size={16} weight="500">
                Team Pro
              </Text>
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
              features={ORG_FEATURES}
              cta={{
                text: 'Contact us',
                href: 'https://codesandbox.typeform.com/organization',
                variant: hasCustomSubscription ? 'light' : 'dark',
              }}
              isHighlighted={hasCustomSubscription}
            >
              <Text size={16} weight="500">
                Organization
              </Text>
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
          </Stack>
        </Stack>
      </Element>
    </ThemeProvider>
  );
};
