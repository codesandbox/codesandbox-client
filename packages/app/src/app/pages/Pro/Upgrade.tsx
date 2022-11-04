import React, { useEffect, useState } from 'react';
import { useAppState, useActions } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  Tooltip,
  Text,
} from '@codesandbox/components';
import { Helmet } from 'react-helmet';
import { Navigation } from 'app/pages/common/Navigation';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import css from '@styled-system/css';
import { sortBy } from 'lodash-es';
import { AnimatePresence, motion } from 'framer-motion';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useLocation, useHistory } from 'react-router-dom';
import { formatCurrency } from 'app/utils/currency';
import { useCreateCheckout } from 'app/hooks';
import {
  UpgradeButton,
  Caption,
  Summary,
  BoxPlaceholder,
  SwitchPlan,
  PlanTitle,
} from './components/elements';
import { Switcher } from './components/Switcher';
import {
  SubscriptionPaymentProvider,
  SubscriptionType,
  TeamMemberAuthorization,
} from '../../graphql/types';

type Interval = 'month' | 'year';

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
  const history = useHistory();

  const [checkout, createCheckout] = useCreateCheckout();
  const [loadingCustomerPortal, createCustomerPortal] = useCreateCustomerPortal(
    activeTeam
  );

  const [interval, setIntervalType] = useState<Interval>('year');

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

  /**
   * Members
   */
  const usersPermission = activeTeamInfo?.userAuthorizations.find(item => {
    return item.userId === user.id;
  });

  const isPro = [
    SubscriptionType.TeamPro,
    SubscriptionType.PersonalPro,
  ].includes(activeTeamInfo?.subscription?.type);
  const isAdmin =
    usersPermission?.authorization === TeamMemberAuthorization.Admin;

  const paidMembers = activeTeamInfo?.userAuthorizations.filter(
    ({ authorization }) =>
      [TeamMemberAuthorization.Admin, TeamMemberAuthorization.Write].includes(
        authorization
      )
  );
  const amountPaidMember = paidMembers.length;
  const hasAnotherPaymentProvider = dashboard.teams.some(
    team =>
      team.subscription?.paymentProvider === SubscriptionPaymentProvider.Paddle
  );

  const summary = {
    year: {
      price: formatCurrency({
        currency: prices[workspaceType].year.currency,
        amount: prices[workspaceType].year.unitAmount / 12,
      }),
      total: formatCurrency({
        amount: (prices[workspaceType].year.unitAmount / 12) * amountPaidMember,
        currency: prices[workspaceType].year.currency,
      }),
      label: `per month, ${formatCurrency({
        amount: prices[workspaceType].year.unitAmount * amountPaidMember,
        currency: prices[workspaceType].year.currency,
      })} annually`,
    },
    month: {
      price: formatCurrency({
        amount: prices[workspaceType].month.unitAmount,
        currency: prices[workspaceType].month.currency,
      }),
      total: formatCurrency({
        amount: prices[workspaceType].month.unitAmount * amountPaidMember,
        currency: prices[workspaceType].month.currency,
      }),
      label: 'per editor per month',
    },
  };

  const savePercent = () => {
    const yearByMonth = prices[workspaceType].year.unitAmount / 12;
    const month = prices[workspaceType].month.unitAmount;

    return (((month - yearByMonth) * 100) / month).toFixed(0);
  };

  return (
    <ThemeProvider>
      <Helmet>
        <title>Pro - CodeSandbox</title>
      </Helmet>
      <Element
        css={css({
          backgroundColor: 'grays.900',
          color: 'white',
          width: '100%',
          minHeight: '100vh',
          fontFamily: "'Inter', sans-serif",
        })}
      >
        <Navigation showActions={false} />

        {hasAnotherPaymentProvider && (
          <Text
            size={3}
            variant="muted"
            css={css({
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
            })}
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

        <Stack
          justify="center"
          align="center"
          css={css({
            width: '100%',
            maxWidth: '713px',
            margin: '0 auto',
            padding: '24px 1em',
          })}
        >
          <Element css={{ width: '100%', paddingTop: '24px' }}>
            <Switcher
              workspaceType={workspaceType}
              workspaces={workspacesList}
              setActiveTeam={setActiveTeam}
              personalWorkspaceId={personalWorkspaceId}
              activeTeamInfo={activeTeamInfo}
              userId={user.id}
              openCreateTeamModal={openCreateTeamModal}
            />
            {isPro ? (
              <>
                <PlanTitle>
                  {workspaceType === 'pro'
                    ? 'You have an active Personal Pro subscription.'
                    : 'You have an active Team Pro subscription.'}
                </PlanTitle>

                <Stack
                  gap={3}
                  css={{
                    display: 'block',
                    '@media (min-width: 720px)': { display: 'flex' },
                  }}
                >
                  <UpgradeButton
                    planType={workspaceType}
                    type="button"
                    onClick={createCustomerPortal}
                    disabled={!isAdmin || loadingCustomerPortal}
                  >
                    {loadingCustomerPortal
                      ? 'Loading...'
                      : 'Manage subscription'}
                  </UpgradeButton>

                  <UpgradeButton
                    planType="none"
                    onClick={() => {
                      history.push(dashboardUrls.settings());
                    }}
                    style={{ color: '#fff' }}
                    variant="secondary"
                  >
                    Go to team settings
                  </UpgradeButton>
                </Stack>
              </>
            ) : (
              <>
                <PlanTitle>
                  {workspaceType === 'pro'
                    ? 'Upgrade to Personal Pro'
                    : 'Upgrade to Team Pro'}
                </PlanTitle>

                <Caption>Payment plan</Caption>

                <Stack
                  justify="space-between"
                  css={{
                    display: 'block',
                    '@media (min-width: 720px)': { display: 'flex' },
                  }}
                >
                  <SwitchPlan
                    type="button"
                    onClick={() => setIntervalType('year')}
                    className={interval === 'year' ? 'active' : ''}
                  >
                    <Stack justify="space-between">
                      <p className="period">Annual</p>
                      <p className="discount">save {savePercent()}%</p>
                    </Stack>
                    <h3 className="price">
                      {summary.year.price}{' '}
                      <span>
                        {formatCurrency({
                          amount: prices[workspaceType].month.unitAmount,
                          currency: prices[workspaceType].month.currency,
                        })}
                      </span>
                    </h3>
                    <p className="caption">
                      per editor per month, billed annually
                    </p>
                  </SwitchPlan>

                  <SwitchPlan
                    type="button"
                    onClick={() => setIntervalType('month')}
                    className={interval === 'month' ? 'active' : ''}
                  >
                    <p className="period">Monthly</p>
                    <h3 className="price">{summary.month.price}</h3>
                    <p className="caption">{summary.month.label}</p>
                  </SwitchPlan>
                </Stack>

                <AnimatePresence>
                  {workspaceType === 'teamPro' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <Caption css={{ paddingTop: 24 }}>
                        <Element
                          css={{ display: 'flex', alignItems: 'center' }}
                        >
                          Paid seats
                          <Tooltip label="The amount of paid seats is automatically calculated by the amount of admin and editors per team.">
                            <Element
                              css={{ display: 'block', marginLeft: '.5em' }}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ display: 'block' }}
                              >
                                <path
                                  d="M6 10.625C3.44568 10.625 1.375 8.55432 1.375 6C1.375 3.44568 3.44568 1.375 6 1.375C8.55432 1.375 10.625 3.44568 10.625 6C10.625 8.55432 8.55432 10.625 6 10.625ZM0.625 6C0.625 8.96853 3.03147 11.375 6 11.375C8.96853 11.375 11.375 8.96853 11.375 6C11.375 3.03147 8.96853 0.625002 6 0.625002C3.03147 0.625002 0.625 3.03147 0.625 6ZM6 8.875C6.20711 8.875 6.375 8.70711 6.375 8.5V6C6.375 5.79289 6.20711 5.625 6 5.625C5.79289 5.625 5.625 5.79289 5.625 6V8.5C5.625 8.70711 5.79289 8.875 6 8.875ZM6 4.5C6.2071 4.5 6.375 4.33211 6.375 4.125L6.375 4.0625C6.375 3.8554 6.20711 3.6875 6 3.6875C5.7929 3.6875 5.625 3.85539 5.625 4.0625L5.625 4.125C5.625 4.3321 5.79289 4.5 6 4.5Z"
                                  fill="#C5C5C5"
                                />
                              </svg>
                            </Element>
                          </Tooltip>
                        </Element>
                      </Caption>

                      <BoxPlaceholder>
                        <span>{amountPaidMember}</span>
                      </BoxPlaceholder>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Stack
                  direction="vertical"
                  css={{
                    width: '100%',
                    marginTop: 24,
                    alignItems: 'flex-start',

                    '@media screen and (min-width: 720px)': {
                      alignItems: 'flex-end',
                    },
                  }}
                  gap={1}
                >
                  <UpgradeButton
                    planType={workspaceType}
                    type="button"
                    onClick={() =>
                      createCheckout({
                        team_id: activeTeamInfo.id,
                        recurring_interval: interval as string,
                      })
                    }
                    disabled={
                      !isAdmin || isPro || checkout.status === 'loading'
                    }
                  >
                    {checkout.status === 'loading'
                      ? 'Loading...'
                      : 'Proceed to checkout'}
                  </UpgradeButton>
                  {checkout.status === 'error' && (
                    <Text variant="danger">
                      {checkout.error}. Please try again.
                    </Text>
                  )}
                </Stack>

                <Summary>
                  <p>
                    {summary[interval].price} x{' '}
                    {`${amountPaidMember} paid seat${
                      amountPaidMember > 1 ? 's' : ''
                    }`}{' '}
                    ={' '}
                    <span>
                      {summary[interval].total} {summary[interval].label}
                    </span>
                  </p>
                  <small>
                    Prices listed {prices.pro.year.currency}. Taxes may apply.
                  </small>
                </Summary>
              </>
            )}
          </Element>
        </Stack>
      </Element>
    </ThemeProvider>
  );
};
