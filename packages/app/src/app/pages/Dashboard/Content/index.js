import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import RecentSandboxes from './routes/RecentSandboxes';
import PathedSandboxes from './routes/PathedSandboxes';
import { Templates, FollowedTemplates } from './routes/Templates';
import DeletedSandboxes from './routes/DeletedSandboxes';
import SearchSandboxes from './routes/SearchSandboxes';
import CreateTeam from './routes/CreateTeam';
import TeamView from './routes/TeamView';

const Content = () => (
  <Switch>
    <Route path="/dashboard/recent" component={RecentSandboxes} />
    <Route path="/dashboard/trash" component={DeletedSandboxes} />
    <Route path="/dashboard/templates" exact component={Templates} />
    <Route path="/dashboard/templates/followed" component={FollowedTemplates} />
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
    />
    <Route
      path="/dashboard/teams/:teamId/templates/followed"
      component={FollowedTemplates}
    />
    <Redirect to="/dashboard/recent" />
  </Switch>
);

export default withRouter(Content);
