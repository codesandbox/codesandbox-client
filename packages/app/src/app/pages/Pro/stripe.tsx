import React, { useEffect, useState } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { ThemeProvider } from '@codesandbox/components';
import { WorkspaceSelect } from '../../components/WorkspaceSelect';
import { usePricing } from './usePricing';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const StripeCheckout = () => {
  const {
    dashboard: { dashboardMounted },
    setActiveTeam,
  } = useActions();
  const state = useAppState();
  const pricing = usePricing();

  const [activeAccount, setActiveAccount] = useState<{
    id: string;
    name: string;
    avatarUrl: string;
  } | null>(null);
  const [recurringInterval, setRecurringInterval] = useState('month');

  useEffect(() => {
    dashboardMounted();
  }, [dashboardMounted]);

  const team = state.dashboard.teams.find(({ id }) => id === state.activeTeam);
  const isPersonalWorkspace = team && team.id === state.personalWorkspaceId;
  const seats = team ? team.users.length : 0;
  const usersPermission = team
    ? team.userAuthorizations.find(item => item.userId === state.user.id)
    : false;

  console.log(team);

  React.useEffect(() => {
    if (team) {
      setActiveAccount({
        id: team.id,
        name: team.name,
        avatarUrl:
          isPersonalWorkspace && state.user
            ? state.user.avatarUrl
            : team.avatarUrl,
      });
    }
  }, [team, isPersonalWorkspace]);

  const createCheckout = async () => {
    const devToken = localStorage.devJwt;

    try {
      const data = await fetch('/api/v1/checkout', {
        method: 'POST',
        body: JSON.stringify({
          team_id: activeAccount.id,
          success_path: '/checkout_success',
          cancel_path: '/checkout_failure',
          recurring_interval: recurringInterval,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: devToken ? `Bearer ${devToken}` : undefined,
        },
      });

      const payload = await data.json();

      if (payload.stripe_checkout_url) {
        window.open(payload.stripe_checkout_url);
      } else {
        throw Error(payload);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const blockButton =
    usersPermission?.authorization !== 'ADMIN' || !!team?.subscription?.type;

  return (
    <ThemeProvider>
      <div>
        <h2>Stripe</h2>

        <div style={{ display: 'flex' }}>
          <div>
            <div>
              {activeAccount && (
                <WorkspaceSelect
                  activeAccount={activeAccount}
                  onSelect={workspace => {
                    setActiveTeam({
                      id: workspace.id,
                    });
                  }}
                />
              )}
            </div>

            <div>
              <select
                defaultValue={recurringInterval}
                onChange={event => setRecurringInterval(event.target.value)}
              >
                <option value="year">year</option>
                <option value="month">month</option>
              </select>
            </div>
          </div>

          <div style={{ marginLeft: 200 }}>
            <h3>Cost: ({isPersonalWorkspace ? 'Personal' : 'Team'})</h3>
            {pricing &&
              formatter.format(
                (pricing[isPersonalWorkspace ? 'pro' : 'team_pro'][
                  recurringInterval
                ].unit_amount *
                  seats) /
                  100
              )}{' '}
            / {recurringInterval}
            <br />
            <br />
            <p>Seats: {seats}</p>
            <p>Permission: {usersPermission?.authorization}</p>
            <p>Current plan: {team?.subscription?.type ?? 'NO PLAN'}</p>
            <br />
            <button
              disabled={blockButton}
              type="button"
              onClick={createCheckout}
            >
              Create stripe checkout
            </button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};
