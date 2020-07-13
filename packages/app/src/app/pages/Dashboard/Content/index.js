import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import codesandbox from '@codesandbox/components/lib/themes/codesandbox.json';
import { ThemeProvider } from '@codesandbox/components';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';

import { NEW_DASHBOARD } from '@codesandbox/common/lib/utils/feature-flags';
import { RecentSandboxes } from './routes/RecentSandboxes';
import PathedSandboxes from './routes/PathedSandboxes';
import { Templates } from './routes/Templates';
import DeletedSandboxes from './routes/DeletedSandboxes';
import SearchSandboxes from './routes/SearchSandboxes';
import CreateTeam from './routes/CreateTeam';
import TeamView from './routes/TeamView';

const Content = () => {
  const { state } = useOvermind();

  return (
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

        {NEW_DASHBOARD ? (
          <Redirect to={dashboard.home(state.activeTeam)} />
        ) : (
          <Redirect to="/dashboard/recent" />
        )}
      </Switch>
    </ThemeProvider>
  );
};

export default withRouter(Content);
