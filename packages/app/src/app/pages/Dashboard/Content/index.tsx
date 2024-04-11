import React, { useEffect } from 'react';
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  useLocation,
} from 'react-router-dom';
import { Element } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { Templates } from './routes/Templates';
import { Deleted } from './routes/Deleted';
import { Drafts } from './routes/Drafts';
import { GetStarted } from './routes/GetStarted';
import { Recent } from './routes/Recent';
import { Shared } from './routes/Shared';
import { Sandboxes } from './routes/Sandboxes';
import { SyncedSandboxes } from './routes/SyncedSandboxes';
import { Search } from './routes/Search';
import { MyContributions } from './routes/MyContributions';
import { RepositoriesPage } from './routes/Repositories';
import { RepositoryBranchesPage } from './routes/RepositoryBranches';

export const Content = withRouter(({ history }) => {
  const { dashboard } = useActions();
  const { activeTeam } = useAppState();
  const { search } = useLocation();

  const mapFromSearchParams = {};
  const searchParams = new URLSearchParams(search);
  searchParams.forEach((value, key) => {
    mapFromSearchParams[key] = value;
  });

  useEffect(() => {
    dashboard.dashboardMounted();
  }, [dashboard]);

  useEffect(() => {
    const removeListener = history.listen(() => {
      dashboard.orderByReset();
    });

    return () => {
      removeListener();
    };
  }, [history, history.listen, dashboard]);

  return (
    <Element
      css={css({
        width: '100%',
        height: '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
      })}
    >
      <Switch>
        <Route path="/dashboard/recent" component={Recent} />
        <Route path="/dashboard/get-started" component={GetStarted} />
        <Route path="/dashboard/drafts" component={Drafts} />
        <Route path="/dashboard/sandboxes/:path*" component={Sandboxes} />
        <Route path="/dashboard/templates" component={Templates} />
        <Route
          path="/dashboard/my-contributions/:path*"
          component={MyContributions}
        />
        <Route
          path="/dashboard/repositories"
          exact
          component={RepositoriesPage}
        />
        <Route
          path="/dashboard/repositories/:path*"
          component={RepositoryBranchesPage}
        />
        <Route
          path="/dashboard/synced-sandboxes/:path*"
          component={SyncedSandboxes}
        />
        <Route path="/dashboard/deleted" component={Deleted} />
        <Route path="/dashboard/shared" component={Shared} />
        <Route path="/dashboard/search" component={Search} />
        {/* old dashboard - redirects: */}
        <Redirect from="/dashboard/archive" to="/dashboard/deleted" />
        <Redirect from="/dashboard/home" to="/dashboard/recent" />
        <Redirect
          from="/dashboard/all/:path*"
          to="/dashboard/sandboxes/:path*"
        />
        <Redirect from="/dashboard/always-on" to="/dashboard/recent" />
        <Redirect to={dashboardUrls.recent(activeTeam, mapFromSearchParams)} />
      </Switch>
    </Element>
  );
});
