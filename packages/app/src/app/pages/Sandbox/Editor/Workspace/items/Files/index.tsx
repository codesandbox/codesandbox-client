import React, { useState } from 'react';

import { useOvermind } from 'app/overmind';
import Files from '../../Files';
import { Dependencies } from '../../Dependencies';
import { WorkspaceItem } from '../../WorkspaceItem';
import { ItemTitle } from '../../elements';

export const FilesItem = () => {
  const [editActions, setEditActions] = useState(null);
  const {
    state: { editor },
  } = useOvermind();
  const staticTemplate = editor.currentSandbox.template === 'static';

  return (
    <div>
      <ItemTitle>
        <span style={{ display: 'inline-block', width: '100%' }}>Explorer</span>{' '}
        {editActions}
      </ItemTitle>
      <div style={{ paddingBottom: '1.75rem' }}>
        <Files setEditActions={setEditActions} />
      </div>
      {!staticTemplate ? (
        <WorkspaceItem defaultOpen title="Dependencies">
          <Dependencies />
        </WorkspaceItem>
      ) : null}
    </div>
  );
};
