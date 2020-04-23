import React, { useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Element, Button, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { StartSandboxes } from './routes/StartSandboxes';
import { Templates } from './routes/Templates';
import { Deleted } from './routes/Deleted';
import { Drafts } from './routes/Drafts';
import { Recent } from './routes/Recent';

const ContentComponent = () => {
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
        {/* <Route path="/dashboard/trash" component={DeletedSandboxes} />
    <Route path="/dashboard/templates" exact component={Templates} />
    <Route path="/dashboard/sandboxes/:path*" component={PathedSandboxes} />
    <Route path="/dashboard/search" component={SearchSandboxes} />
    <Route path="/dashboard/teams/new" component={CreateTeam} />
    <Route exact path="/dashboard/teams/:teamId" component={TeamView} />
    <Route
      path="/dashboard/teams/:teamId/sandboxes/:path*"
      component={PathedSandboxes}
    />
    <Route
      path="/dashboard/teams/:teamId/templates"
      component={Templates}
      exact
    /> */}
        <Redirect to="/new-dashboard/start" />
      </Switch>
    </Element>
  );
};

export const Content = withRouter(ContentComponent);
