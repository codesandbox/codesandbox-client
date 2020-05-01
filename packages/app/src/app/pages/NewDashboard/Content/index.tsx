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
import { Settings } from './routes/Settings';

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
          render={() => <All key={window.location.pathname} />}
        />
        <Route
          path="/new-dashboard/settings"
          render={() => <Settings key={dashboard.activeTeam} />}
        />

        <Redirect to="/new-dashboard/start" />
      </Switch>
    </Element>
  );
};
