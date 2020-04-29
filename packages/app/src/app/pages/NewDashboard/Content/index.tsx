import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { StartSandboxes } from './routes/StartSandboxes';
import { Templates } from './routes/Templates';
import { Deleted } from './routes/Deleted';
import { Drafts } from './routes/Drafts';
import { Recent } from './routes/Recent';
import { All } from './routes/All';
import { Search } from './routes/Search';

export const Content = () => {
  const {
    state: { dashboard },
    actions,
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.newDashboardMounted();
  }, [actions.dashboard]);

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
      <Switch>
        <Route
          path="/new-dashboard/start"
          render={() => <StartSandboxes key={dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/templates"
          render={() => <Templates key={dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/deleted"
          render={() => <Deleted key={dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/drafts"
          render={() => <Drafts key={dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/recent"
          render={() => <Recent key={dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/all/drafts"
          render={() => <Drafts key={dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/search"
          render={() => <Search key={dashboard.activeTeam} />}
        />
        <Route
          path="/new-dashboard/all/:path*"
          render={({ match }) => <All key={window.location.pathname} />}
        />

        <Redirect to="/new-dashboard/start" />
      </Switch>
    </Element>
  );
};
