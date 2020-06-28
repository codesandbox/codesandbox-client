import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import codesandbox from '@codesandbox/components/lib/themes/codesandbox.json';
import { ThemeProvider } from '@codesandbox/components';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';

import { RecentSandboxes } from './routes/RecentSandboxes';
import PathedSandboxes from './routes/PathedSandboxes';
import { Templates } from './routes/Templates';
import DeletedSandboxes from './routes/DeletedSandboxes';
import SearchSandboxes from './routes/SearchSandboxes';
import CreateTeam from './routes/CreateTeam';
import TeamView from './routes/TeamView';

const Content = () => {
  const { state } = useOvermind();

  // Only use get it from localStorage here, since we need to be able to find this before we can fetch the user.
  // We shouldn't use it at other places
  const isPilot = JSON.parse(localStorage.getItem('pilot') || 'undefined');

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

        {isPilot ? (
          <Redirect to={dashboard.home(state.activeTeam)} />
        ) : (
          <Redirect to="/dashboard/recent" />
        )}
      </Switch>
    </ThemeProvider>
  );
};

export default withRouter(Content);
