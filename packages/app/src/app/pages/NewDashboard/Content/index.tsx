import React, { useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Home } from './routes/Home';
import { Templates } from './routes/Templates';
import { Deleted } from './routes/Deleted';
import { Drafts } from './routes/Drafts';
import { Recent } from './routes/Recent';
import { All } from './routes/All';
import { Search } from './routes/Search';
import { Settings } from './routes/Settings';

export const Content = withRouter(({ history }) => {
  const {
    state: { dashboard },
    actions,
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.dashboardMounted();
  }, [actions.dashboard]);

  history.listen(() => {
    actions.dashboard.blacklistedTemplatesCleared();
    actions.dashboard.orderByChanged({
      order: 'desc',
      field: 'updatedAt',
    });
  });

  return (
    <Element
      css={css({
        width: '100%',
        margin: '0 auto',
      })}
    >
      <Switch>
        <Route
          path="/new-dashboard/home"
          render={() => <Home key={dashboard.activeTeam} />}
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

        <Redirect to="/new-dashboard/home" />
      </Switch>
    </Element>
  );
});
