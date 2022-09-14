import React, { useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Element } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { Home } from './routes/Home';
import { Templates } from './routes/Templates';
import { Deleted } from './routes/Deleted';
import { Drafts } from './routes/Drafts';
import { Recent } from './routes/Recent';
import { Shared } from './routes/Shared';
import { Liked } from './routes/Liked';
import { AlwaysOn } from './routes/AlwaysOn';
import { All } from './routes/All';
import { Repositories } from './routes/Repositories';
import { Search } from './routes/Search';
import { Settings } from './routes/Settings';
import { Discover } from './routes/Discover';
import { Album } from './routes/Discover/Album';
import { Curate } from './routes/Discover/Curate';
import { CommunitySearch } from './routes/Discover/CommunitySearch';

export const Content = withRouter(({ history }) => {
  const { dashboard } = useActions();
  const { activeTeam } = useAppState();

  useEffect(() => {
    dashboard.dashboardMounted();
  }, [dashboard]);

  useEffect(() => {
    const removeListener = history.listen(() => {
      dashboard.blacklistedTemplatesCleared();
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
        <Route path="/dashboard/home" component={Home} />
        <Route path="/dashboard/drafts" component={Drafts} />
        <Route path="/dashboard/all/:path*" component={All} />
        <Route path="/dashboard/templates" component={Templates} />
        <Route
          path="/dashboard/repositories/legacy/:path*"
          component={Repositories}
        />
        <Route path="/dashboard/always-on" component={AlwaysOn} />
        <Route path="/dashboard/recent" component={Recent} />
        <Route path="/dashboard/deleted" component={Deleted} />
        <Route path="/dashboard/shared" component={Shared} />
        <Route path="/dashboard/liked" component={Liked} />
        <Route path="/dashboard/search" component={Search} />
        <Route path="/dashboard/discover/search" component={CommunitySearch} />
        <Route path="/dashboard/discover/curate" component={Curate} />
        <Route path="/dashboard/discover/:id" component={Album} />
        <Route path="/dashboard/discover" component={Discover} />
        <Route path="/dashboard/settings" component={Settings} />
        {/* old dashboard - redirects: */}
        <Route path="/dashboard/trash" component={Deleted} />
        <Route path="/dashboard/sandboxes/:path*" component={All} />
        <Redirect to={dashboardUrls.home(activeTeam)} />
      </Switch>
    </Element>
  );
});
