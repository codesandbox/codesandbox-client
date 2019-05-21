import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import RecentSandboxes from './routes/RecentSandboxes';
import PathedSandboxes from './routes/PathedSandboxes';
import PathedTemplates from './routes/PathedTemplates';
import DeletedSandboxes from './routes/DeletedSandboxes';
import SearchSandboxes from './routes/SearchSandboxes';
import CreateTeam from './routes/CreateTeam';
import TeamView from './routes/TeamView';

const Content = () => (
  <Switch>
    <Route path="/dashboard/recent" component={RecentSandboxes} />
    <Route path="/dashboard/trash" component={DeletedSandboxes} />
    <Route path="/dashboard/templates/" component={PathedTemplates} />

    <Route path="/dashboard/sandboxes/:path*" component={PathedSandboxes} />
    <Route path="/dashboard/search" component={SearchSandboxes} />
    <Route path="/dashboard/teams/new" component={CreateTeam} />
    <Route exact path="/dashboard/teams/:teamId" component={TeamView} />
    <Route
      path="/dashboard/teams/:teamId/sandboxes/:path*"
      component={PathedSandboxes}
    />
    <Redirect to="/dashboard/recent" />
  </Switch>
);

export default withRouter(Content);
