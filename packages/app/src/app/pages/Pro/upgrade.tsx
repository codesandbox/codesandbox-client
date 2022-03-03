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
import {
  usePricing,
  formatCurrent,
  createCheckout,
  WorkspaceType,
  Interval,
} from './upgrade/utils';
import { WorkspaceSelect } from '../../components/WorkspaceSelect';
import {
  Button,
  Caption,
  Summary,
  BoxPlaceholder,
  PlanButton,
  GlobalFonts,
  Title,
} from './upgrade/elements';
import { Switcher } from './upgrade/Switcher';

const COLOR_SCHEMA: Record<WorkspaceType, string> = {
  pro: '#AC9CFF',
  team_pro: '#EDFFA5',
};

export const ProUpgrade = () => {
  const { pageMounted } = useActions().pro;
  const { setActiveTeam } = useActions();
  const state = useAppState();
  const pricing = usePricing();

  const [interval, setIntervalType] = useState<Interval>('month');

  useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  if (!state.hasLoadedApp || !state.isLoggedIn || !pricing) return null;

  const workspaceType =
    (state.activeTeamInfo.id === state.personalWorkspaceId
      ? 'pro'
      : 'team_pro') ?? 'pro';

  const usersPermission = state.activeTeamInfo.userAuthorizations.find(
    item => item.userId === state.user.id
  );

  const blockButton =
    usersPermission?.authorization !== 'ADMIN' ||
    !!state.activeTeamInfo?.subscription?.type;

  const savePercent = () => {
    const yearByMonth = pricing[workspaceType].year.unit_amount / 12;
    const month = pricing[workspaceType].month.unit_amount;

    return (((month - yearByMonth) * 100) / month).toFixed(0);
  };

  const workspaceTypeLabel =
    workspaceType === 'pro' ? 'Upgrade to Personal Pro' : 'Upgrade to Team Pro';

  /**
   * Paid members
   */
  const seats = state.activeTeamInfo.userAuthorizations.filter(
    ({ authorization }) =>
      authorization === 'ADMIN' || authorization === 'WRITE'
  ).length;
  const seatsLabel = `${seats} member${seats > 1 ? 's' : ''}`;

  const summary = {
    year: {
      price: formatCurrent({
        currency: pricing[workspaceType].year.currency,
        unit_amount: pricing[workspaceType].year.unit_amount / 12,
      }),
      total: formatCurrent({
        unit_amount: (pricing[workspaceType].year.unit_amount / 12) * seats,
        currency: pricing[workspaceType].year.currency,
      }),
      label: 'per month, billed annually',
    },
    month: {
      price: formatCurrent(pricing[workspaceType].month),
      total: formatCurrent({
        unit_amount: pricing[workspaceType].month.unit_amount * seats,
        currency: pricing[workspaceType].month.currency,
      }),
      label: 'per month',
    },
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
            <Switcher />
            {/* {state.activeTeamInfo && (
              <WorkspaceSelect
                activeAccount={state.activeTeamInfo}
                onSelect={workspace => {
                  setActiveTeam({
                    id: workspace.id,
                  });
                }}
              />
            )} */}

            {/* <Caption>{memberLabel}</Caption>

            {state.activeTeamInfo.users.map((user, index) => {
              if (index > 2) return null;

              return (
                <img
                  style={{ width: 50 }}
                  src={user.avatarUrl}
                  alt={user.username}
                  key={user.id}
                />
              );
            })} */}

            {/* {seats - 3 > 0 ? seats - 3 : null} */}

            <Title style={{ color: COLOR_SCHEMA[workspaceType] }}>
              {workspaceTypeLabel}
            </Title>

            <Caption>Payment plan</Caption>

            <Stack justify="space-between" css={{ marginBottom: 24 }}>
              <PlanButton
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
              </PlanButton>

              <PlanButton
                type="button"
                onClick={() => setIntervalType('month')}
                className={interval === 'month' ? 'active' : ''}
              >
                <p>Monthly</p>
                <h3 className="price">{summary.month.price}</h3>
                <p className="caption" style={{ width: 100 }}>
                  {summary.month.label}
                </p>
              </PlanButton>
            </Stack>

            {workspaceType === 'team_pro' && (
              <>
                <Caption>
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
                  <span>{seats}</span>
                </BoxPlaceholder>
              </>
            )}

            <Stack direction="horizontal">
              <Element css={{ flex: 1 }} />

              <Button
                style={{ backgroundColor: COLOR_SCHEMA[workspaceType] }}
                type="button"
                onClick={() =>
                  createCheckout({
                    team_id: state.activeTeamInfo.id,
                    recurring_interval: interval as string,
                  })
                }
                disabled={blockButton}
              >
                {workspaceTypeLabel}
              </Button>
            </Stack>

            <Summary>
              <p>
                {summary[interval].price} x {seatsLabel} ={' '}
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
