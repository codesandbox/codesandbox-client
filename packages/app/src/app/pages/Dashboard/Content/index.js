import React from 'react';
import { Route } from 'react-router-dom';
import RecentSandboxes from './RecentSandboxes';
import PathedSandboxes from './PathedSandboxes';

import DragLayer from './DragLayer';

export default class Content extends React.Component {
  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <React.Fragment>
        <DragLayer />

        <Route path="/dashboard/recents" component={RecentSandboxes} />
        <Route path="/dashboard/sandboxes/:path*" component={PathedSandboxes} />
      </React.Fragment>
    );
  }
}
