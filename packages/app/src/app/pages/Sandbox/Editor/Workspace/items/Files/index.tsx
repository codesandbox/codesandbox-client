import * as React from 'react';

import Files from '../../Files';
import Dependencies from '../../Dependencies';
import WorkspaceItem from '../../WorkspaceItem';
import OpenedTabs from '../../OpenedTabs';

export default () => (
  <div>
    <OpenedTabs />
    <Files />
    <WorkspaceItem title="Dependencies">
      <Dependencies />
    </WorkspaceItem>
  </div>
);
