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
import { Repositories } from './routes/Repositories';
import { Search } from './routes/Search';
import { Settings } from './routes/Settings';

export const Content = withRouter(({ history }) => {
  const { actions } = useOvermind();

  useEffect(() => {
    actions.dashboard.dashboardMounted();
  }, [actions.dashboard]);

  useEffect(() => {
    const removeListener = history.listen(() => {
      actions.dashboard.blacklistedTemplatesCleared();
      actions.dashboard.orderByChanged({
        order: 'desc',
        field: 'updatedAt',
      });
    });

    return () => {
      removeListener();
    };
  }, [history, history.listen, actions.dashboard]);

  return (
    <Element
      css={css({
        width: '100%',
        margin: '0 auto',
      })}
    >
      <Switch>
        <Route path="/new-dashboard/home" component={Home} />
        <Route path="/new-dashboard/templates" component={Templates} />
        <Route path="/new-dashboard/deleted" component={Deleted} />
        <Route path="/new-dashboard/drafts" component={Drafts} />
        <Route path="/new-dashboard/recent" component={Recent} />
        <Route path="/new-dashboard/all/drafts" component={Drafts} />
        <Route
          path="/new-dashboard/repositories/:path*"
          component={Repositories}
        />
        <Route path="/new-dashboard/search" component={Search} />
        <Route path="/new-dashboard/all/:path*" component={All} />
        <Route path="/new-dashboard/settings" component={Settings} />

        <Redirect to="/new-dashboard/home" />
      </Switch>
    </Element>
  );
});
