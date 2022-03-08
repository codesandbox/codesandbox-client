import React, { useEffect, useState } from 'react';
import { useAppState, useActions } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  Tooltip,
} from '@codesandbox/components';
import { Helmet } from 'react-helmet';
import { Navigation } from 'app/pages/common/Navigation';
import css from '@styled-system/css';
import { sortBy } from 'lodash-es';
import { AnimatePresence, motion } from 'framer-motion';
import {
  usePricing,
  formatCurrent,
  useCreateCheckout,
  WorkspaceType,
  Interval,
} from './upgrade/utils';
import {
  UpgradeButton,
  Caption,
  Summary,
  BoxPlaceholder,
  SwitchPlan,
  GlobalFonts,
  PlanTitle,
} from './upgrade/elements';
import { Switcher } from './upgrade/Switcher';
import { SubscriptionType, TeamMemberAuthorization } from '../../graphql/types';

const COLOR_SCHEMA: Record<WorkspaceType, string> = {
  pro: '#AC9CFF',
  team_pro: '#EDFFA5',
};

export const ProUpgrade = () => {
  const {
    pro: { pageMounted },
    setActiveTeam,
  } = useActions();
  const {
    activeTeamInfo,
    dashboard,
    hasLoadedApp,
    isLoggedIn,
    personalWorkspaceId,
    user,
  } = useAppState();
  const pricing = usePricing();
  const { loading, createCheckout } = useCreateCheckout();

  const [interval, setIntervalType] = useState<Interval>('month');

  useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  if (!hasLoadedApp || !isLoggedIn || !pricing) return null;

  /**
   * Workspace
   */
  const personalWorkspace = dashboard.teams.find(team => {
    return team.id === personalWorkspaceId;
  })!;
  const workspaceType =
    (activeTeamInfo.id === personalWorkspaceId ? 'pro' : 'team_pro') ?? 'pro';
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
  const usersPermission = activeTeamInfo.userAuthorizations.find(item => {
    return item.userId === user.id;
  });

  const isPro = [
    SubscriptionType.TeamPro,
    SubscriptionType.PersonalPro,
  ].includes(activeTeamInfo?.subscription?.type);
  const isAdmin =
    usersPermission?.authorization === TeamMemberAuthorization.Admin;

  const paidMembers = activeTeamInfo.userAuthorizations.filter(
    ({ authorization }) =>
      [TeamMemberAuthorization.Admin, TeamMemberAuthorization.Write].includes(
        authorization
      )
  );
  const amountPaidMember = paidMembers.length;

  const summary = {
    year: {
      price: formatCurrent({
        currency: pricing[workspaceType].year.currency,
        unit_amount: pricing[workspaceType].year.unit_amount / 12,
      }),
      total: formatCurrent({
        unit_amount:
          (pricing[workspaceType].year.unit_amount / 12) * amountPaidMember,
        currency: pricing[workspaceType].year.currency,
      }),
      label: 'per month, billed annually',
    },
    month: {
      price: formatCurrent(pricing[workspaceType].month),
      total: formatCurrent({
        unit_amount:
          pricing[workspaceType].month.unit_amount * amountPaidMember,
        currency: pricing[workspaceType].month.currency,
      }),
      label: 'per month',
    },
  };

  const savePercent = () => {
    const yearByMonth = pricing[workspaceType].year.unit_amount / 12;
    const month = pricing[workspaceType].month.unit_amount;

    return (((month - yearByMonth) * 100) / month).toFixed(0);
  };

  const buttonLabel = () => {
    if (loading) return 'Loading...';

    return workspaceType === 'pro'
      ? 'Upgrade to Personal Pro'
      : 'Upgrade to Team Pro';
  };

  return (
    <ThemeProvider>
      <GlobalFonts />
      <Helmet>
        <title>Pro - CodeSandbox</title>
      </Helmet>
      <Stack
        direction="vertical"
        css={css({
          backgroundColor: 'grays.900',
          color: 'white',
          width: '100%',
          minHeight: '100vh',
        })}
      >
        <Navigation title="CodeSandbox Pro" />

        <Stack
          justify="center"
          align="center"
          css={css({
            height: '100%',
            width: '100%',
            maxWidth: '713px',
            margin: 'auto',
            padding: '24px 1em',
          })}
        >
          <Element css={{ width: '100%' }}>
            <Switcher
              workspaceType={workspaceType}
              workspaces={workspacesList}
              setActiveTeam={setActiveTeam}
              personalWorkspaceId={personalWorkspaceId}
              activeTeamInfo={activeTeamInfo}
              userId={user.id}
            />

            <PlanTitle style={{ color: COLOR_SCHEMA[workspaceType] }}>
              {workspaceType === 'pro'
                ? 'Upgrade to Personal Pro'
                : 'Upgrade to Team Pro'}
            </PlanTitle>

            <Caption>Payment plan</Caption>

            <Stack justify="space-between">
              <SwitchPlan
                type="button"
                onClick={() => setIntervalType('year')}
                className={interval === 'year' ? 'active' : ''}
              >
                <Stack justify="space-between">
                  <p>Annual</p>
                  <p className="discount">save {savePercent()}%</p>
                </Stack>
                <h3 className="price">{summary.year.price}</h3>
                <p style={{ width: 140 }}>
                  per editor per month, billed annually
                </p>
              </SwitchPlan>

              <SwitchPlan
                type="button"
                onClick={() => setIntervalType('month')}
                className={interval === 'month' ? 'active' : ''}
              >
                <p>Monthly</p>
                <h3 className="price">{summary.month.price}</h3>
                <p className="caption" style={{ width: 100 }}>
                  {summary.month.label}
                </p>
              </SwitchPlan>
            </Stack>

            <AnimatePresence>
              {workspaceType === 'team_pro' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <Caption css={{ paddingTop: 24 }}>
                    <Element css={{ display: 'flex', alignItems: 'center' }}>
                      Team members
                      <Tooltip label="Current number of team members. You can  always add or remove team members in the team settings.">
                        <Element css={{ display: 'block', marginLeft: '.5em' }}>
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

            <Stack direction="horizontal" css={{ marginTop: 24 }}>
              <Element css={{ flex: 1 }} />

              <UpgradeButton
                style={{ backgroundColor: COLOR_SCHEMA[workspaceType] }}
                type="button"
                onClick={() =>
                  createCheckout({
                    team_id: activeTeamInfo.id,
                    recurring_interval: interval as string,
                  })
                }
                disabled={!isAdmin || isPro}
              >
                {buttonLabel()}
              </UpgradeButton>
            </Stack>

            <Summary>
              <p>
                {summary[interval].price} x{' '}
                {`${amountPaidMember} member${amountPaidMember > 1 ? 's' : ''}`}{' '}
                ={' '}
                <span>
                  {summary[interval].total} {summary[interval].label}
                </span>
              </p>
              <small>
                Prices listed {pricing.pro.year.currency}. Taxes may apply.
              </small>
            </Summary>
          </Element>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
