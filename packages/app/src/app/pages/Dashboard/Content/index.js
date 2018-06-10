import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import RecentSandboxes from './routes/RecentSandboxes';
import PathedSandboxes from './routes/PathedSandboxes';
import DeletedSandboxes from './routes/DeletedSandboxes';
import SearchSandboxes from './routes/SearchSandboxes';

const Content = () => (
  <Switch>
    <Route path="/dashboard/recents" component={RecentSandboxes} />
    <Route path="/dashboard/trash" component={DeletedSandboxes} />
    <Route path="/dashboard/sandboxes/:path*" component={PathedSandboxes} />
    <Route path="/dashboard/search" component={SearchSandboxes} />
    <Redirect to="/dashboard/recents" />
  </Switch>
);

export default withRouter(Content);
