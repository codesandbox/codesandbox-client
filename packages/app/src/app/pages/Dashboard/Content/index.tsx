import React, { useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Element } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Home } from './routes/Home';
import { Templates } from './routes/Templates';
import { Deleted } from './routes/Deleted';
import { Drafts } from './routes/Drafts';
import { Recent } from './routes/Recent';
import { All } from './routes/All';
import { Repositories } from './routes/Repositories';
import { Search } from './routes/Search';
import { Settings } from './routes/Settings';
import { NewTeam } from './routes/Settings/NewTeam';

export const Content = withRouter(({ history }) => {
  const { actions, state } = useOvermind();

  useEffect(() => {
    actions.dashboard.dashboardMounted();
  }, [actions.dashboard]);

  useEffect(() => {
    const removeListener = history.listen(() => {
      actions.dashboard.blacklistedTemplatesCleared();
      actions.dashboard.orderByReset();
    });

    return () => {
      removeListener();
    };
  }, [history, history.listen, actions.dashboard]);

  return (
    <Element
      css={css({
        width: '100%',
        height: '100%',
        margin: '0 auto',
      })}
    >
      <Switch>
        <Route path="/dashboard/home" component={Home} />
        <Route path="/dashboard/templates" component={Templates} />
        {/* old dashboard redirect */}
        <Route path="/dashboard/trash" component={Deleted} />
        <Route path="/dashboard/deleted" component={Deleted} />
        <Route path="/dashboard/drafts" component={Drafts} />
        <Route path="/dashboard/recent" component={Recent} />
        <Route path="/dashboard/search" component={Search} />
        <Route path="/dashboard/repositories/:path*" component={Repositories} />
        {/* old dashboard redirect */}
        <Route path="/dashboard/sandboxes/:path*" component={All} />
        <Route path="/dashboard/all/:path*" component={All} />
        <Route path="/dashboard/settings" component={Settings} />
        {/* old dashboard redirect */}
        <Route path="/dashboard/teams/new" component={NewTeam} />
        <Redirect to={dashboardUrls.home(state.activeTeam)} />
      </Switch>
    </Element>
  );
});
