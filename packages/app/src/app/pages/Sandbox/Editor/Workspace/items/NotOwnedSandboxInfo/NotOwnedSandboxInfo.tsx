import React, { useState } from 'react';

import Dependencies from '../../Dependencies';
import Files from '../../Files';
import Project from '../../Project';
import WorkspaceItem from '../../WorkspaceItem';
import TemplateInfo from '../../Project/Template';

import { useStore } from 'app/store';

export const NotOwnedSandboxInfo = () => {
  const {
    editor: { currentSandbox },
    user,
  } = useStore();
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
      {user && (currentSandbox.git || {}).username === user.username && (
        <TemplateInfo template={currentSandbox.customTemplate} />
      )}
    </div>
  );
};
