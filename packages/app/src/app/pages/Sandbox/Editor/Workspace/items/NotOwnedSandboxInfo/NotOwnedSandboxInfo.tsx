import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import { MultiAction } from '@codesandbox/common/lib/components/MultiAction';
import { Dependencies } from '../../Dependencies';
import Files from '../../Files';
import { Project } from '../../Project';
import { WorkspaceItem } from '../../WorkspaceItem';
import { ButtonContainer } from './elements';

export const NotOwnedSandboxInfo = () => {
  const [editActions, setEditActions] = useState(null);
  const {
    state: { editor },
  } = useOvermind();
  const staticTemplate = editor.currentSandbox.template === 'static';

  return (
    <div style={{ marginTop: '1rem' }}>
      <Project />
      <ButtonContainer>
        <MultiAction block small primaryActionLabel="Follow Template">
          <button type="button">Add to Followed Templates</button>
          <button type="button">Add to Team#1 Followed Templates</button>
        </MultiAction>
      </ButtonContainer>
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
