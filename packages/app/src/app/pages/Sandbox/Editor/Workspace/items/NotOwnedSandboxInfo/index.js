import React, { useState } from 'react';

import Project from '../../Project';
import Files from '../../Files';
import Dependencies from '../../Dependencies';
import WorkspaceItem from '../../WorkspaceItem';

export default () => {
  const [editActions, setEditActions] = useState(null);

  return (
    <div style={{ marginTop: '1rem' }}>
      <Project />

      <WorkspaceItem
        style={{ marginTop: '.5rem' }}
        actions={editActions}
        defaultOpen
        title="Files"
      >
        <Files setEditActions={setEditActions} />
      </WorkspaceItem>
      <WorkspaceItem
        style={{ marginTop: '.5rem' }}
        defaultOpen
        title="Dependencies"
      >
        <Dependencies />
      </WorkspaceItem>
    </div>
  );
};
