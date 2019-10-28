import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import { Dependencies } from '../../Dependencies';
import Files from '../../Files';
import { Project } from '../../Project';
import { FollowTemplateButton } from '../../Project/FollowTemplateButton';
import { WorkspaceItem } from '../../WorkspaceItem';

export const NotOwnedSandboxInfo = () => {
  const [editActions, setEditActions] = useState(null);
  const {
    state: { editor },
  } = useOvermind();
  const staticTemplate = editor.currentSandbox.template === 'static';

  return (
    <div style={{ marginTop: '1rem' }}>
      <Project />
      {editor.currentSandbox.customTemplate &&
        editor.currentSandbox.customTemplate.published && (
          <FollowTemplateButton />
        )}
      <WorkspaceItem
        actions={editActions}
        defaultOpen
        style={{ marginTop: '.5rem' }}
        title="Files"
      >
        <Files setEditActions={setEditActions} />
      </WorkspaceItem>
      {!staticTemplate ? (
        <WorkspaceItem
          defaultOpen
          style={{ marginTop: '.5rem' }}
          title="Dependencies"
        >
          <Dependencies />
        </WorkspaceItem>
      ) : null}
    </div>
  );
};
