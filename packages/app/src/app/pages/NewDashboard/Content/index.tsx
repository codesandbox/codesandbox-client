import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

// import { RecentSandboxes } from './routes/RecentSandboxes';
// import PathedSandboxes from './routes/PathedSandboxes';
// import { Templates } from './routes/Templates';
// import DeletedSandboxes from './routes/DeletedSandboxes';
// import SearchSandboxes from './routes/SearchSandboxes';
// import CreateTeam from './routes/CreateTeam';
// import TeamView from './routes/TeamView';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { StartSandboxes } from './routes/StartSandboxes';
import { Templates } from './routes/Templates';
import { Deleted } from './routes/Deleted';
import { Drafts } from './routes/Drafts';
import { Recent } from './routes/Recent';

const ContentComponent = () => (
  <Element
    as="main"
    css={css({
      maxWidth: 992,
      paddingX: 4,
      width: '100%',
      margin: '40px auto',
    })}
  >
    <Switch>
      <Route path="/new-dashboard/start" component={StartSandboxes} />
      <Route path="/new-dashboard/templates" component={Templates} />
      <Route path="/new-dashboard/deleted" component={Deleted} />
      <Route path="/new-dashboard/drafts" component={Drafts} />
      <Route path="/new-dashboard/recent" component={Recent} />
      {/* <Route path="/dashboard/trash" component={DeletedSandboxes} />
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
    /> */}
      <Redirect to="/new-dashboard/start" />
    </Switch>
  </Element>
);

export const Content = withRouter(ContentComponent);
