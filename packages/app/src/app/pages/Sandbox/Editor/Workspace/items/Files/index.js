import React, { useState } from 'react';

import Files from '../../Files';
import Dependencies from '../../Dependencies';
import WorkspaceItem from '../../WorkspaceItem';
import { ItemTitle } from '../../elements';

export default () => {
  const [editActions, setEditActions] = useState(null);

  return (
    <div>
      <ItemTitle>
        <span style={{ display: 'inline-block', width: '100%' }}>Explorer</span>{' '}
        {editActions}
      </ItemTitle>
      <Files setEditActions={setEditActions} />
      <WorkspaceItem defaultOpen title="Dependencies">
        <Dependencies />
      </WorkspaceItem>
    </div>
  );
};
