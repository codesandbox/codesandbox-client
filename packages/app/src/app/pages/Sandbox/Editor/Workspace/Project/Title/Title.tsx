import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { useSignals, useStore } from 'app/store';
import { WorkspaceInputContainer } from '../../elements';
import { EditPen } from '../elements';
import { SandboxTitle } from './elements';

type ITitleProps = {
  editable: boolean;
};

export const Title = observer<ITitleProps>(({ editable }) => {
  const [editing, setEditing] = useState(false);
  const {
    editor: { currentSandbox },
    workspace: {
      project: { title },
    },
  } = useStore();
  const {
    workspace: { valueChanged, sandboxInfoUpdated },
  } = useSignals();

  return editing ? (
    <WorkspaceInputContainer style={{ margin: '0 -0.25rem' }}>
      <input
        type="text"
        placeholder="Title"
        ref={el => {
          if (el) {
            el.focus();
          }
        }}
        value={title || getSandboxName(currentSandbox)}
        onChange={event => {
          valueChanged({
            field: 'title',
            value: event.target.value,
          });
        }}
        onBlur={() => {
          sandboxInfoUpdated();
          setEditing(false);
        }}
        onKeyUp={event => {
          if (event.keyCode === 13) {
            sandboxInfoUpdated();
            setEditing(false);
          }
        }}
      />
    </WorkspaceInputContainer>
  ) : (
    <SandboxTitle>
      {getSandboxName(currentSandbox)}
      {editable && <EditPen onClick={() => setEditing(true)} />}
    </SandboxTitle>
  );
});
