import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Dependencies } from '../../Dependencies';
import { SandboxInfo } from './SandboxInfo';
import { BookmarkTemplateButton } from '../../Project/BookmarkTemplateButton';
import { Files } from '../../Files';
import { WorkspaceItem } from '../../WorkspaceItem';

export const NotOwnedSandboxInfo = () => {
  const [editActions, setEditActions] = useState(null);
  const {
    state: { editor, hasLogIn },
  } = useOvermind();
  const staticTemplate = editor.currentSandbox.template === 'static';

  return (
    <div style={{ marginTop: '1rem' }}>
      <Margin bottom={1.5}>
        <SandboxInfo sandbox={editor.currentSandbox} />
        {editor.currentSandbox.customTemplate && hasLogIn && (
          <BookmarkTemplateButton />
        )}
      </Margin>

      <WorkspaceItem actions={editActions} defaultOpen title="Files">
        <Files setEditActions={setEditActions} />
      </WorkspaceItem>
      {!staticTemplate ? (
        <WorkspaceItem defaultOpen title="Dependencies">
          <Dependencies />
        </WorkspaceItem>
      ) : null}
    </div>
  );
};
