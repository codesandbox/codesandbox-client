import React, { useState } from 'react';
import Dependencies from '../../Dependencies';
import Files from '../../Files';
import { Project } from '../../Project';
import WorkspaceItem from '../../WorkspaceItem';

export const NotOwnedSandboxInfo = () => {
  const [editActions, setEditActions] = useState(null);

  return (
    <div style={{ marginTop: '1rem' }}>
      <Project />
      <WorkspaceItem
        actions={editActions}
        defaultOpen
        style={{ marginTop: '.5rem' }}
        title="Files"
      >
        <Files setEditActions={setEditActions} />
      </WorkspaceItem>
      <WorkspaceItem
        defaultOpen
        style={{ marginTop: '.5rem' }}
        title="Dependencies"
      >
        <Dependencies />
      </WorkspaceItem>
    </div>
  );
};
