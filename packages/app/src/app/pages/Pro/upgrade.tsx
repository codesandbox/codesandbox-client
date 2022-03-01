import React, { useEffect, useState } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { ThemeProvider } from '@codesandbox/components';
import { WorkspaceSelect } from '../../components/WorkspaceSelect';
import { usePricing, formatCurrent, createCheckout } from './upgrade/utils';

export const ProUpgrade = () => {
  const { pageMounted } = useActions().pro;
  const { setActiveTeam } = useActions();
  const state = useAppState();
  const pricing = usePricing();

  const [recurringInterval, setRecurringInterval] = useState<'year' | 'month'>(
    'month'
  );

  useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  if (!state.hasLoadedApp || !state.isLoggedIn || !pricing) return null;

  const workspaceType =
    (state.activeTeamInfo.id === state.personalWorkspaceId
      ? 'pro'
      : 'team_pro') ?? 'pro';
  const seats = state.activeTeamInfo.users.length;
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

  const memberLabel = `${seats} member${seats > 1 ? 's' : ''}`;
  const workspaceTypeLabel =
    workspaceType === 'pro' ? 'Upgrade to Personal Pro' : 'Upgrade to Team Pro';

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
      label: 'per editor, month-on-month',
    },
  };

  return (
    <ThemeProvider>
      <div>
        <div>
          {state.activeTeamInfo && (
            <WorkspaceSelect
              activeAccount={state.activeTeamInfo}
              onSelect={workspace => {
                setActiveTeam({
                  id: workspace.id,
                });
              }}
            />
          )}

          <p>{memberLabel}</p>

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
          })}

          {seats - 3 > 0 ? seats - 3 : null}

          <h1>{workspaceTypeLabel}</h1>

          <h2>Payment plan</h2>

          <button type="button" onClick={() => setRecurringInterval('year')}>
            <p>Annual</p>
            <p>Save: {savePercent()}%</p>
            <h3>{summary.year.price}</h3>
            <p>{summary.year.label}</p>
          </button>

          <button type="button" onClick={() => setRecurringInterval('month')}>
            <p>Monthly</p>
            <h3>{summary.month.price}</h3>
            <p>{summary.month.label}</p>
          </button>

          {workspaceType === 'team_pro' && (
            <>
              <h2>Team members</h2>
              <p>{seats}</p>

              <button
                type="button"
                onClick={() =>
                  createCheckout({
                    team_id: state.activeTeamInfo.id,
                    recurring_interval: recurringInterval as string,
                  })
                }
                disabled={blockButton}
              >
                {workspaceTypeLabel}
              </button>
            </>
          )}

          <p>
            {summary[recurringInterval].price} x {memberLabel} =
            <strong>
              {summary[recurringInterval].total}{' '}
              {summary[recurringInterval].label}
            </strong>
            <small>
              Prices listed {pricing.pro.year.currency}. Taxes may apply.
            </small>
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};
