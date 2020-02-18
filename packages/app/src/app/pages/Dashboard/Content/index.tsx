import React, { FunctionComponent } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import codesandbox from '@codesandbox/components/lib/themes/codesandbox.json';
import { ThemeProvider } from '@codesandbox/components';

import CreateTeam from './routes/CreateTeam';
import DeletedSandboxes from './routes/DeletedSandboxes';
import PathedSandboxes from './routes/PathedSandboxes';
import { RecentSandboxes } from './routes/RecentSandboxes';
import SearchSandboxes from './routes/SearchSandboxes';
import TeamView from './routes/TeamView';
import { Templates } from './routes/Templates';

export const Content: FunctionComponent = () => (
  <ThemeProvider theme={codesandbox}>
    <Switch>
    <Route path="/dashboard/recent" component={RecentSandboxes} />

    <Route path="/dashboard/trash" component={DeletedSandboxes} />

    <Route path="/dashboard/templates" exact component={Templates} />

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

      <Redirect to="/dashboard/recent" />
    </Switch>
  </ThemeProvider>
);
