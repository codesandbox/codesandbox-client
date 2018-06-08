import React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import RecentSandboxes from './RecentSandboxes';
import PathedSandboxes from './PathedSandboxes';
import DeletedSandboxes from './DeletedSandboxes';

const Content = () => (
  <React.Fragment>
    <Route path="/dashboard/recents" component={RecentSandboxes} />
    <Route path="/dashboard/trash" component={DeletedSandboxes} />
    <Route path="/dashboard/sandboxes/:path*" component={PathedSandboxes} />
  </React.Fragment>
);

export default withRouter(Content);
