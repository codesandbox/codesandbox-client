import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Element, Button, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { StartSandboxes } from './routes/StartSandboxes';
import { Templates } from './routes/Templates';
import { Deleted } from './routes/Deleted';
import { Drafts } from './routes/Drafts';
import { Recent } from './routes/Recent';
import { All } from './routes/All';

export const Content = () => {
  const { actions, state } = useOvermind();
  useEffect(() => {
    actions.dashboard.getTeams();
  }, [actions.dashboard, state.user]);

  return (
    <Element
      as="main"
      css={css({
        maxWidth: 992,
        paddingX: 4,
        width: '100%',
        margin: '40px auto',
      })}
    >
      <Stack gap={2}>
        <Button
          variant={
            state.dashboard.activeTeam === null ? 'primary' : 'secondary'
          }
          style={{ width: 'auto' }}
          onClick={() => actions.dashboard.setActiveTeam({ id: null })}
        >
          Me
        </Button>
        {state.dashboard.teams.map(team => (
          <Button
            variant={
              state.dashboard.activeTeam === team.id ? 'primary' : 'secondary'
            }
            onClick={() => actions.dashboard.setActiveTeam({ id: team.id })}
            style={{ width: 'auto' }}
          >
            {team.name}
          </Button>
        ))}
      </Stack>
      <Switch>
        <Route
          path="/new-dashboard/start"
          render={() => <StartSandboxes key={state.dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/templates"
          render={() => <Templates key={state.dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/deleted"
          render={() => <Deleted key={state.dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/drafts"
          render={() => <Drafts key={state.dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/recent"
          render={() => <Recent key={state.dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/all/drafts"
          render={() => <Drafts key={state.dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/all/:path*"
          render={({ match }) => (
            <All key={state.dashboard.activeTeam + window.location.pathname} />
          )}
        />

        <Redirect to="/new-dashboard/start" />
      </Switch>
    </Element>
  );
};
